import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trash2,
  List,
  Save,
  Check,
} from 'lucide-react-native';
import { useBooking } from '@/contexts/booking-context';
import { LocalStorage } from '@/lib/storage';
import { 
  generateDayMeals, 
  getDatesBetween, 
  formatDateForDisplay,
  MEAL_LIMITS,
  MEAL_CATEGORY_NAMES
} from '@/lib/meals';
import type { MealItem, DayMealSelections } from '@/types/api';

export default function MealsScreen() {
  const { bookingData } = useBooking();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dayMeals, setDayMeals] = useState<{ [K in keyof typeof MEAL_LIMITS]: MealItem[] }>({
    breakfast: [],
    snacks: [],
    lunch: [],
    dinner: [],
  });
  const [selections, setSelections] = useState<DayMealSelections>({
    breakfast: [],
    snacks: [],
    lunch: [],
    dinner: [],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stayDates = useMemo(() => {
    if (!bookingData) return [];
    return getDatesBetween(bookingData.checkIn, bookingData.checkOut);
  }, [bookingData]);

  useEffect(() => {
    if (stayDates.length > 0 && !selectedDate) {
      setSelectedDate(stayDates[0]);
    }
  }, [stayDates, selectedDate]);

  useEffect(() => {
    if (selectedDate && bookingData) {
      loadDayData();
    }
  }, [selectedDate, bookingData]);

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDate && bookingData) {
      setIsSaved(true);
    }
  }, [selectedDate]);

  const loadDayData = async () => {
    if (!selectedDate || !bookingData) return;

    try {
      const savedSelections = await LocalStorage.getMealSelections(bookingData.bookingCode, selectedDate);
      
      if (savedSelections) {
        setSelections(savedSelections);
      } else {
        setSelections({
          breakfast: [],
          snacks: [],
          lunch: [],
          dinner: [],
        });
      }

      const meals = generateDayMeals();
      setDayMeals(meals);
    } catch (error) {
      console.error('Error loading day data:', error);
    }
  };

  const saveSelections = async (newSelections: DayMealSelections, showToast = false) => {
    if (!selectedDate || !bookingData) return;

    try {
      await LocalStorage.setMealSelections(bookingData.bookingCode, selectedDate, newSelections);
      setSelections(newSelections);
      setIsSaved(true);
      
      if (showToast) {
        showSuccessToast('Escolhas do dia salvas!');
      }
    } catch (error) {
      console.error('Error saving selections:', error);
      if (showToast) {
        Alert.alert('Erro', 'Erro ao salvar as escolhas');
      }
    }
  };

  const autoSave = useCallback((newSelections: DayMealSelections) => {
    setIsSaved(false);
    setIsAutoSaving(true);
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(async () => {
      await saveSelections(newSelections, false);
      setIsAutoSaving(false);
    }, 500) as ReturnType<typeof setTimeout>;
  }, [selectedDate, bookingData]);

  const showSuccessToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Sucesso', message);
    }
  };

  const toggleMealSelection = (category: keyof typeof MEAL_LIMITS, mealId: string) => {
    const currentSelections = selections[category];
    const limit = MEAL_LIMITS[category];
    
    if (currentSelections.includes(mealId)) {
      const newSelections = {
        ...selections,
        [category]: currentSelections.filter(id => id !== mealId),
      };
      setSelections(newSelections);
      autoSave(newSelections);
    } else if (currentSelections.length < limit) {
      const newSelections = {
        ...selections,
        [category]: [...currentSelections, mealId],
      };
      setSelections(newSelections);
      autoSave(newSelections);
    } else {
      Alert.alert(
        'Limite atingido',
        `Você já selecionou o máximo de ${limit} ${category === 'snacks' ? 'petiscos' : 'item'} para ${MEAL_CATEGORY_NAMES[category].toLowerCase()}.`
      );
    }
  };

  const clearDaySelections = () => {
    Alert.alert(
      'Limpar escolhas do dia',
      `Tem certeza que deseja limpar todas as escolhas de ${formatDateForDisplay(selectedDate)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            const emptySelections = {
              breakfast: [],
              snacks: [],
              lunch: [],
              dinner: [],
            };
            setSelections(emptySelections);
            autoSave(emptySelections);
          },
        },
      ]
    );
  };

  const clearAllSelections = () => {
    Alert.alert(
      'Limpar todas as escolhas',
      'Tem certeza que deseja limpar todas as escolhas de refeições da estadia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar tudo',
          style: 'destructive',
          onPress: async () => {
            if (!bookingData) return;
            try {
              await LocalStorage.clearMealSelections(bookingData.bookingCode);
              const emptySelections = {
                breakfast: [],
                snacks: [],
                lunch: [],
                dinner: [],
              };
              setSelections(emptySelections);
              Alert.alert('Sucesso', 'Todas as escolhas foram limpas!');
            } catch (error) {
              console.error('Error clearing all selections:', error);
              Alert.alert('Erro', 'Erro ao limpar as escolhas');
            }
          },
        },
      ]
    );
  };

  const showSummary = () => {
    router.push('/meals-summary');
  };

  const saveDayManually = async () => {
    if (!selectedDate || !bookingData) return;
    await saveSelections(selections, true);
  };

  const getSaveButtonStatus = () => {
    if (isAutoSaving) return { text: 'Salvando...', icon: Save, disabled: true };
    if (isSaved) return { text: 'Salvo', icon: Check, disabled: true };
    return { text: 'Salvar dia', icon: Save, disabled: false };
  };

  const renderMealCard = (meal: MealItem, category: keyof typeof MEAL_LIMITS) => {
    const isSelected = selections[category].includes(meal.id);
    const canSelect = selections[category].length < MEAL_LIMITS[category];

    return (
      <TouchableOpacity
        key={meal.id}
        style={[styles.mealCard, isSelected && styles.selectedMealCard]}
        onPress={() => toggleMealSelection(category, meal.id)}
        disabled={!canSelect && !isSelected}
      >
        <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.mealDescription} numberOfLines={2}>
            {meal.description}
          </Text>
        </View>
        <View style={[styles.selectionBadge, isSelected && styles.selectedBadge]}>
          <Text style={[styles.badgeText, isSelected && styles.selectedBadgeText]}>
            {isSelected ? 'Selecionado' : 'Selecionar'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMealCategory = (category: keyof typeof MEAL_LIMITS) => {
    const meals = dayMeals[category];
    const selectedCount = selections[category].length;
    const limit = MEAL_LIMITS[category];

    return (
      <View key={category} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>
            {MEAL_CATEGORY_NAMES[category]}
          </Text>
          <Text style={styles.categoryCounter}>
            {selectedCount}/{limit}
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.mealsRow}>
            {meals.map(meal => renderMealCard(meal, category))}
          </View>
        </ScrollView>
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
        <Text style={styles.title}>Refeições Inclusas</Text>
        <Text style={styles.subtitle}>Escolha suas refeições por dia</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowDatePicker(!showDatePicker)}
          >
            <Calendar size={20} color="#2563eb" />
            <Text style={styles.dateSelectorText}>
              {formatDateForDisplay(selectedDate)}
            </Text>
            {showDatePicker ? (
              <ChevronUp size={20} color="#6b7280" />
            ) : (
              <ChevronDown size={20} color="#6b7280" />
            )}
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                getSaveButtonStatus().disabled && styles.saveButtonDisabled
              ]} 
              onPress={saveDayManually}
              disabled={getSaveButtonStatus().disabled}
            >
              {React.createElement(getSaveButtonStatus().icon, {
                size: 16,
                color: getSaveButtonStatus().disabled ? "#9ca3af" : "#10b981"
              })}
              <Text style={[
                styles.saveButtonText,
                getSaveButtonStatus().disabled && styles.saveButtonTextDisabled
              ]}>
                {getSaveButtonStatus().text}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={showSummary}>
              <List size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={clearDaySelections}>
              <RotateCcw size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={clearAllSelections}>
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <View style={styles.datePicker}>
            {stayDates.map(date => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateOption,
                  date === selectedDate && styles.selectedDateOption,
                ]}
                onPress={() => {
                  setSelectedDate(date);
                  setShowDatePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    date === selectedDate && styles.selectedDateOptionText,
                  ]}
                >
                  {formatDateForDisplay(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.keys(MEAL_LIMITS).map(category => 
          renderMealCategory(category as keyof typeof MEAL_LIMITS)
        )}
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  dateSelectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  saveButtonDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10b981',
  },
  saveButtonTextDisabled: {
    color: '#9ca3af',
  },
  datePicker: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    gap: 8,
  },
  dateOption: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  selectedDateOption: {
    backgroundColor: '#2563eb',
  },
  dateOptionText: {
    fontSize: 14,
    color: '#1f2937',
    textAlign: 'center',
  },
  selectedDateOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  categoryCounter: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  mealCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedMealCard: {
    borderWidth: 2,
    borderColor: '#10b981',
  },
  mealImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  mealInfo: {
    padding: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  selectionBadge: {
    margin: 12,
    marginTop: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  selectedBadge: {
    backgroundColor: '#10b981',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  selectedBadgeText: {
    color: 'white',
  },
  errorText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 40,
  },
});