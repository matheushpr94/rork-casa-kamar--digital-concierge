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
  X,
  Clock,
} from 'lucide-react-native';
import { servicesRepo, requestsRepo } from '@/lib/repositories';
import { useBooking } from '@/contexts/booking-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';

import { SkeletonItemList } from '@/components/ui/SkeletonItemList';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Service, ServiceVariant } from '@/lib/ports/services.port';
import * as Haptics from 'expo-haptics';



export default function ServicesScreen() {
  const { bookingData } = useBooking();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant | null>(null);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: servicesRepo.list,
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
    setSelectedVariant(service.variants?.[0] || null);
    setNotes('');
    setQuantity('1');
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedService || !bookingData?.bookingCode) return;
    
    try {
      setIsSubmitting(true);
      
      const finalPrice = selectedVariant?.price || selectedService.price;
      
      await requestsRepo.create(selectedService.id, {
        userId: bookingData.bookingCode,
        note: notes.trim() || undefined,
        variantId: selectedVariant?.id,
        price: finalPrice,
      });
      
      // Invalidate orders query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['orders', bookingData.bookingCode] });
      
      setShowRequestModal(false);
      showToast('Solicitação enviada com sucesso!');
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      Alert.alert('Erro', 'Não foi possível enviar a solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredServices = services || [];

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



      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesGrid}>
          {isLoading ? (
            <SkeletonItemList count={6} />
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service: Service) => {
              return (
                <TouchableOpacity
                  key={service.id}
                  onPress={() => handleServicePress(service)}
                  testID={`service-${service.id}`}
                >
                  <Card style={styles.serviceCard}>
                    <View style={styles.serviceIcon}>
                      <Sparkles size={24} color="#2563eb" />
                    </View>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.servicePrice}>
                      {service.variants && service.variants.length > 0 
                        ? `A partir de R$ ${Math.min(...service.variants.map((v: ServiceVariant) => v.price)).toFixed(2)}`
                        : service.price ? `R$ ${service.price.toFixed(2)}` : 'Consultar'}
                    </Text>
                    {service.durationMin && (
                      <View style={styles.leadTimeContainer}>
                        <Clock size={12} color="#6b7280" />
                        <Text style={styles.leadTime}>
                          {service.durationMin < 60 ? `${service.durationMin} min` : 
                           `${Math.floor(service.durationMin / 60)}h${service.durationMin % 60 ? ` ${service.durationMin % 60}min` : ''}`}
                        </Text>
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
              subtitle="Os serviços aparecerão aqui quando estiverem disponíveis"
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
                  {selectedVariant 
                    ? `R$ ${selectedVariant.price.toFixed(2)}` 
                    : selectedService.price ? `R$ ${selectedService.price.toFixed(2)}` : 'Consultar'}
                </Text>
                <Text style={styles.serviceInfoDescription}>
                  {selectedService.description}
                </Text>
                
                {selectedService.variants && selectedService.variants.length > 0 && (
                  <View style={styles.variantsContainer}>
                    <Text style={styles.variantsLabel}>Opções:</Text>
                    <View style={styles.variantsChips}>
                      {selectedService.variants.map((variant) => (
                        <Chip
                          key={variant.id}
                          label={`${variant.name} - R$ ${variant.price.toFixed(2)}`}
                          selected={selectedVariant?.id === variant.id}
                          onPress={() => setSelectedVariant(variant)}
                          style={styles.variantChip}
                        />
                      ))}
                    </View>
                  </View>
                )}
                {selectedService.durationMin && (
                  <View style={styles.leadTimeContainer}>
                    <Clock size={14} color="#6b7280" />
                    <Text style={styles.leadTimeText}>
                      Duração: {selectedService.durationMin < 60 ? `${selectedService.durationMin} min` : 
                               `${Math.floor(selectedService.durationMin / 60)}h${selectedService.durationMin % 60 ? ` ${selectedService.durationMin % 60}min` : ''}`}
                    </Text>
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
  variantsContainer: {
    marginTop: 16,
  },
  variantsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  variantsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantChip: {
    marginBottom: 8,
  },
});