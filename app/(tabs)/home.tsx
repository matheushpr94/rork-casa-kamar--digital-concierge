import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { 
  Sparkles, 
  ChefHat, 
  Car, 
  Shirt, 
  Utensils, 
  ShoppingCart 
} from 'lucide-react-native';
import { getServices } from '@/lib/api';
import { useBooking } from '@/contexts/booking-context';
import { Card } from '@/components/ui/Card';
import { SkeletonItemList } from '@/components/ui/SkeletonItemList';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Service } from '@/types/api';

const serviceIcons = {
  cleaning: Sparkles,
  kitchen: ChefHat,
  transport: Car,
  laundry: Shirt,
  dining: Utensils,
  shopping: ShoppingCart,
};

export default function ServicesScreen() {
  const { bookingData } = useBooking();
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  const handleServicePress = (service: Service) => {
    if (!service?.id?.trim()) return;
    router.push(`/service/${service.id}`);
  };

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
        <Text style={styles.greeting}>Olá, {bookingData.guestName}!</Text>
        <Text style={styles.subtitle}>Como podemos ajudá-lo hoje?</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesGrid}>
          {isLoading ? (
            <SkeletonItemList count={6} />
          ) : services && services.length > 0 ? (
            services.map((service) => {
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
                    <Text style={styles.serviceDescription} numberOfLines={2}>
                      {service.description}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            })
          ) : (
            <EmptyState
              title="Nenhum serviço disponível"
              subtitle="Os serviços aparecerão aqui quando estiverem disponíveis"
              icon={<Sparkles size={48} color="#6b7280" />}
            />
          )}
        </View>
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
    padding: 24,
    paddingBottom: 16,
    paddingTop: 16,
  },
  greeting: {
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
  serviceDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 40,
  },
});