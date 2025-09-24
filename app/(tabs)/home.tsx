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
            <Text style={styles.loadingText}>Carregando serviços...</Text>
          ) : (
            services?.map((service) => {
              const IconComponent = serviceIcons[service.category as keyof typeof serviceIcons] || Sparkles;
              
              return (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  onPress={() => handleServicePress(service)}
                  testID={`service-${service.id}`}
                >
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
                </TouchableOpacity>
              );
            })
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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