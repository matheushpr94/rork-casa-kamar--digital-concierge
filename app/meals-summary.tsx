import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Edit3,
  Share2,
  Coffee,
  Cookie,
  UtensilsCrossed,
  Moon,
  AlertCircle,
} from 'lucide-react-native';
import { useBooking } from '@/contexts/booking-context';
import { LocalStorage } from '@/lib/storage';
import {
  getDatesBetween,
  formatDateForDisplay,
  MEAL_CATEGORY_NAMES,
  MEAL_LIMITS,
  MEAL_ITEMS,
} from '@/lib/meals';
import type { DayMealSelections } from '@/types/api';

type MealSummaryData = {
  [date: string]: DayMealSelections;
};

const CATEGORY_ICONS = {
  breakfast: Coffee,
  snacks: Cookie,
  lunch: UtensilsCrossed,
  dinner: Moon,
} as const;

export default function MealsSummaryScreen() {
  const { bookingData } = useBooking();
  const insets = useSafeAreaInsets();
  const [summaryData, setSummaryData] = useState<MealSummaryData>({});
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportText, setExportText] = useState('');

  const stayDates = React.useMemo(() => {
    if (!bookingData) return [];
    return getDatesBetween(bookingData.checkIn, bookingData.checkOut);
  }, [bookingData]);

  useEffect(() => {
    loadSummaryData();
  }, [bookingData, stayDates]);

  const loadSummaryData = async () => {
    if (!bookingData || stayDates.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const data: MealSummaryData = {};
      
      for (const date of stayDates) {
        const selections = await LocalStorage.getMealSelections(bookingData.bookingCode, date);
        if (selections) {
          data[date] = selections;
        }
      }
      
      setSummaryData(data);
    } catch (error) {
      console.error('Error loading summary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMealName = (mealId: string): string => {
    const meal = MEAL_ITEMS.find(m => m.id === mealId);
    return meal?.name || 'Item não encontrado';
  };

  const getDayCompletionStatus = (date: string) => {
    const selections = summaryData[date];
    if (!selections) return { complete: false, missing: Object.keys(MEAL_LIMITS) };

    const missing: string[] = [];
    
    Object.entries(MEAL_LIMITS).forEach(([category, limit]) => {
      const categoryKey = category as keyof typeof MEAL_LIMITS;
      const selected = selections[categoryKey]?.length || 0;
      if (selected < limit) {
        missing.push(MEAL_CATEGORY_NAMES[categoryKey]);
      }
    });

    return { complete: missing.length === 0, missing };
  };

  const generateExportText = () => {
    if (!bookingData) return '';

    let text = `🏨 REFEIÇÕES INCLUSAS - CASA KAMARÁ\n`;
    text += `📅 Período: ${formatDateForDisplay(bookingData.checkIn)} → ${formatDateForDisplay(bookingData.checkOut)}\n`;
    text += `👤 Hóspede: ${bookingData.guestName}\n`;
    text += `🔖 Reserva: ${bookingData.bookingCode}\n\n`;

    stayDates.forEach((date, index) => {
      const dayNumber = index + 1;
      const selections = summaryData[date];
      const status = getDayCompletionStatus(date);
      
      text += `📆 DIA ${dayNumber} - ${formatDateForDisplay(date)}\n`;
      
      if (!selections || !status.complete) {
        text += `⚠️ Escolhas incompletas`;
        if (status.missing.length > 0) {
          text += ` (Faltam: ${status.missing.join(', ')})`;
        }
        text += `\n\n`;
        return;
      }

      // Café da Manhã
      text += `☕ Café da Manhã: ${selections.breakfast.map(id => getMealName(id)).join(', ') || 'Não selecionado'}\n`;
      
      // Petiscos
      text += `🍪 Petiscos: ${selections.snacks.map(id => getMealName(id)).join(', ') || 'Não selecionado'}\n`;
      
      // Almoço
      text += `🍽️ Almoço: ${selections.lunch.map(id => getMealName(id)).join(', ') || 'Não selecionado'}\n`;
      
      // Jantar
      text += `🌙 Jantar: ${selections.dinner.map(id => getMealName(id)).join(', ') || 'Não selecionado'}\n\n`;
    });

    text += `\n✨ Gerado pelo App Casa Kamará`;
    return text;
  };

  const handleExport = () => {
    const text = generateExportText();
    setExportText(text);
    setShowExportModal(true);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: exportText,
        title: 'Refeições Inclusas - Casa Kamará',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleEditDay = (date: string) => {
    router.back();
    // Note: We'll need to pass the date somehow, for now just go back
    // In a real implementation, you might use query params or global state
  };

  const renderDayCard = (date: string, index: number) => {
    const selections = summaryData[date];
    const status = getDayCompletionStatus(date);
    const dayNumber = index + 1;

    return (
      <View key={date} style={styles.dayCard}>
        <View style={styles.dayHeader}>
          <View style={styles.dayInfo}>
            <Text style={styles.dayNumber}>Dia {dayNumber}</Text>
            <Text style={styles.dayDate}>{formatDateForDisplay(date)}</Text>
          </View>
          
          <View style={styles.dayActions}>
            {!status.complete && (
              <View style={styles.incompleteIndicator}>
                <AlertCircle size={16} color="#f59e0b" />
              </View>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditDay(date)}
            >
              <Edit3 size={16} color="#6b7280" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!status.complete && (
          <View style={styles.warningBanner}>
            <AlertCircle size={16} color="#f59e0b" />
            <Text style={styles.warningText}>
              Faltam escolhas: {status.missing.join(', ')}
            </Text>
          </View>
        )}

        <View style={styles.mealsGrid}>
          {Object.entries(MEAL_CATEGORY_NAMES).map(([category, name]) => {
            const categoryKey = category as keyof typeof MEAL_LIMITS;
            const Icon = CATEGORY_ICONS[categoryKey];
            const selectedMeals = selections?.[categoryKey] || [];
            const limit = MEAL_LIMITS[categoryKey];
            
            return (
              <View key={category} style={styles.mealCategory}>
                <View style={styles.categoryHeader}>
                  <Icon size={16} color="#6b7280" />
                  <Text style={styles.categoryName}>{name}</Text>
                  <Text style={styles.categoryCount}>
                    {selectedMeals.length}/{limit}
                  </Text>
                </View>
                
                <View style={styles.mealsList}>
                  {selectedMeals.length > 0 ? (
                    selectedMeals.map(mealId => (
                      <Text key={mealId} style={styles.mealName}>
                        • {getMealName(mealId)}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.noMealText}>Não selecionado</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (!bookingData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Dados da reserva não encontrados</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Resumo da Estadia</Text>
            <Text style={styles.subtitle}>
              {formatDateForDisplay(bookingData.checkIn)} → {formatDateForDisplay(bookingData.checkOut)}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExport}
          >
            <Share2 size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando resumo...</Text>
          </View>
        ) : (
          <View style={styles.daysContainer}>
            {stayDates.map((date, index) => renderDayCard(date, index))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showExportModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top + 16 }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowExportModal(false)}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Exportar Resumo</Text>
            
            <TouchableOpacity
              style={styles.modalShareButton}
              onPress={handleShare}
            >
              <Share2 size={20} color="#2563eb" />
              <Text style={styles.modalShareText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.exportTextInput}
              value={exportText}
              onChangeText={setExportText}
              multiline
              textAlignVertical="top"
              placeholder="Texto do resumo..."
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  exportButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  daysContainer: {
    padding: 24,
    gap: 16,
  },
  dayCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayInfo: {
    flex: 1,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dayDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  dayActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  incompleteIndicator: {
    padding: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#92400e',
    flex: 1,
  },
  mealsGrid: {
    gap: 12,
  },
  mealCategory: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  mealsList: {
    marginLeft: 24,
  },
  mealName: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 2,
  },
  noMealText: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCloseButton: {
    padding: 8,
    marginLeft: -8,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    marginRight: -8,
  },
  modalShareText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  exportTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    textAlignVertical: 'top',
    minHeight: 400,
  },
});