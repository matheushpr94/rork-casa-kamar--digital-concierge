import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Sparkles, 
  ChefHat, 
  Car, 
  Shirt, 
  Utensils, 
  ShoppingCart,
  X,
  Clock,
} from 'lucide-react-native';
import { getServices, createOrder } from '@/lib/api';
import { useBooking } from '@/contexts/booking-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SkeletonItemList } from '@/components/ui/SkeletonItemList';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Service } from '@/types/api';
import * as Haptics from 'expo-haptics';

const serviceIcons = {
  cleaning: Sparkles,
  kitchen: ChefHat,
  transport: Car,
  laundry: Shirt,
  dining: Utensils,
  shopping: ShoppingCart,
};

const categories = ['Todos', 'Limpeza', 'Cozinha', 'Transporte', 'Lavanderia'];

export default function ServicesScreen() {
  const { bookingData } = useBooking();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });
  
  const queryClient = useQueryClient();

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else if (Platform.OS === 'web') {
      console.log(message);
    }
  };

  const handleServicePress = (service: Service) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSelectedService(service);
    setNotes('');
    setQuantity('1');
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedService || !bookingData?.bookingCode) return;
    
    try {
      setIsSubmitting(true);
      
      const now = new Date();
      const orderData = {
        bookingCode: bookingData.bookingCode,
        serviceId: selectedService.id,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        quantity: parseInt(quantity) || 1,
        notes: notes.trim(),
      };
      
      await createOrder(orderData);
      
      // Invalidate orders query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['orders', bookingData.bookingCode] });
      
      setShowRequestModal(false);
      showToast('Solicitação enviada com sucesso!');
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Erro', 'Não foi possível enviar a solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredServices = services?.filter(service => {
    if (selectedCategory === 'Todos') return true;
    return service.category?.toLowerCase() === selectedCategory.toLowerCase();
  }) || [];

  if (!bookingData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando dados da reserva...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Serviços Disponíveis</Text>
        <Text style={styles.subtitle}>Solicite os serviços que precisa</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.categoryChip}
          />
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesGrid}>
          {isLoading ? (
            <SkeletonItemList count={6} />
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const IconComponent = serviceIcons[service.category as keyof typeof serviceIcons] || Sparkles;
              
              return (
                <TouchableOpacity
                  key={service.id}
                  onPress={() => handleServicePress(service)}
                  testID={`service-${service.id}`}
                >
                  <Card style={styles.serviceCard}>
                    <View style={styles.serviceIcon}>
                      <IconComponent size={24} color="#2563eb" />
                    </View>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.servicePrice}>
                      R$ {service.price.toFixed(2)}
                      {service.unit && ` / ${service.unit}`}
                    </Text>
                    {service.leadTime && (
                      <View style={styles.leadTimeContainer}>
                        <Clock size={12} color="#6b7280" />
                        <Text style={styles.leadTime}>{service.leadTime}</Text>
                      </View>
                    )}
                    <Text style={styles.serviceDescription} numberOfLines={2}>
                      {service.description}
                    </Text>
                    <Button
                      title="Solicitar"
                      onPress={() => handleServicePress(service)}
                      variant="primary"
                      style={styles.requestButton}
                    />
                  </Card>
                </TouchableOpacity>
              );
            })
          ) : (
            <EmptyState
              title="Nenhum serviço encontrado"
              subtitle={selectedCategory === 'Todos' 
                ? "Os serviços aparecerão aqui quando estiverem disponíveis"
                : `Nenhum serviço encontrado na categoria ${selectedCategory}`
              }
              icon={<Sparkles size={48} color="#6b7280" />}
            />
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showRequestModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Solicitar Serviço</Text>
            <TouchableOpacity onPress={() => setShowRequestModal(false)}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {selectedService && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceInfoName}>{selectedService.name}</Text>
                <Text style={styles.serviceInfoPrice}>
                  R$ {selectedService.price.toFixed(2)}
                  {selectedService.unit && ` / ${selectedService.unit}`}
                </Text>
                <Text style={styles.serviceInfoDescription}>
                  {selectedService.description}
                </Text>
                {selectedService.leadTime && (
                  <View style={styles.leadTimeContainer}>
                    <Clock size={14} color="#6b7280" />
                    <Text style={styles.leadTimeText}>Prazo: {selectedService.leadTime}</Text>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Quantidade</Text>
                <TextInput
                  style={styles.formInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="1"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Observações (opcional)</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Adicione detalhes sobre sua solicitação..."
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>
          )}

          <View style={styles.modalFooter}>
            <Button
              title="Cancelar"
              onPress={() => setShowRequestModal(false)}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title={isSubmitting ? 'Enviando...' : 'Solicitar'}
              onPress={handleSubmitRequest}
              variant="primary"
              loading={isSubmitting}
              style={styles.submitButton}
            />
          </View>
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
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  servicesGrid: {
    padding: 16,
    gap: 16,
  },
  serviceCard: {
    marginBottom: 16,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#10b981',
    marginBottom: 8,
  },
  leadTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  leadTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  leadTimeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  requestButton: {
    marginTop: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  serviceInfo: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  serviceInfoName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  serviceInfoPrice: {
    fontSize: 18,
    fontWeight: '500',
    color: '#10b981',
    marginBottom: 8,
  },
  serviceInfoDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});