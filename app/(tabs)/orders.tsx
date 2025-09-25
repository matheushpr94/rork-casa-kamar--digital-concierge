import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Clock, CheckCircle, XCircle, AlertCircle, ShoppingBag } from 'lucide-react-native';
import { requestsRepo, servicesRepo } from '@/lib/repositories';
import { useBooking } from '@/contexts/booking-context';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

import type { ServiceRequest } from '@/lib/ports/requests.port';
import type { Service, ServiceVariant } from '@/lib/ports/services.port';

const statusConfig = {
  pending: {
    label: 'Pendente',
    variant: 'neutral' as const,
    icon: Clock,
  },
  received: {
    label: 'Recebido',
    variant: 'neutral' as const,
    icon: Clock,
  },
  in_progress: {
    label: 'Em Andamento',
    variant: 'indigo' as const,
    icon: AlertCircle,
  },
  done: {
    label: 'Concluído',
    variant: 'emerald' as const,
    icon: CheckCircle,
  },
  canceled: {
    label: 'Cancelado',
    variant: 'rose' as const,
    icon: XCircle,
  },
};

export default function OrdersScreen() {
  const { bookingData } = useBooking();

  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['orders', bookingData?.bookingCode],
    queryFn: () => requestsRepo.listByUser(bookingData?.bookingCode || 'mock-user'),
    enabled: !!bookingData?.bookingCode,
  });
  
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: servicesRepo.list,
  });



  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };



  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getServiceName = (serviceId: string): Service | null => {
    return services?.find(s => s.id === serviceId) || null;
  };
  
  const getVariantName = (service: Service | null, variantId?: string): ServiceVariant | null => {
    if (!service || !variantId || !service.variants) return null;
    return service.variants.find(v => v.id === variantId) || null;
  };

  const renderRequestCard = (request: ServiceRequest) => {
    const status = statusConfig[request.status];
    const IconComponent = status.icon;
    const service = getServiceName(request.serviceId);
    const variant = getVariantName(service, request.variantId);

    return (
      <View key={request.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.serviceName}>
            {service?.name || 'Serviço Solicitado'}
            {variant && (
              <Text style={styles.variantName}> ({variant.name})</Text>
            )}
          </Text>
          <Badge
            label={status.label}
            variant={status.variant}
            icon={<IconComponent size={12} />}
          />
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.orderDate}>
            📅 {formatDate(request.createdAt)} às {formatTime(request.createdAt)}
          </Text>
          {request.note && (
            <Text style={styles.orderNotes}>
              📝 {request.note}
            </Text>
          )}
          {(request.price || service?.price) && (
            <Text style={styles.servicePrice}>
              💰 R$ {(request.price || service?.price || 0).toFixed(2)}
            </Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderId}>#{request.id}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.title}>Minhas Solicitações</Text>
        <Text style={styles.subtitle}>Acompanhe seus pedidos</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <Text style={styles.loadingText}>Carregando solicitações...</Text>
        ) : requests && requests.length > 0 ? (
          <View style={styles.ordersList}>
            <Button
              title={refreshing ? 'Atualizando...' : 'Atualizar'}
              onPress={handleRefresh}
              loading={refreshing}
              style={styles.refreshButton}
            />
            {requests.map(renderRequestCard)}
          </View>
        ) : (
          <EmptyState
            title="Você ainda não tem solicitações"
            subtitle="Seus pedidos aparecerão aqui quando você solicitar algum serviço"
            icon={<ShoppingBag size={48} color="#6b7280" />}
          />
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
  ordersList: {
    padding: 16,
    gap: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },

  orderDetails: {
    gap: 8,
    marginBottom: 16,
  },
  orderDate: {
    fontSize: 14,
    color: '#64748b',
  },
  orderQuantity: {
    fontSize: 14,
    color: '#64748b',
  },
  orderNotes: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  servicePrice: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  orderId: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'monospace',
  },

  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 40,
  },
  refreshButton: {
    marginBottom: 16,
  },
  variantName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6b7280',
  },
});