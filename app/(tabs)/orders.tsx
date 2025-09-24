import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react-native';
import { getOrders, updateOrderStatus } from '@/lib/api';
import { useBooking } from '@/contexts/booking-context';
import type { Order } from '@/types/api';

const statusConfig = {
  RECEIVED: {
    label: 'Recebido',
    color: '#3b82f6',
    icon: Clock,
  },
  IN_PROGRESS: {
    label: 'Em Andamento',
    color: '#f59e0b',
    icon: AlertCircle,
  },
  COMPLETED: {
    label: 'Concluído',
    color: '#10b981',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelado',
    color: '#ef4444',
    icon: XCircle,
  },
};

export default function OrdersScreen() {
  const { bookingData } = useBooking();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['orders', bookingData?.bookingCode],
    queryFn: () => getOrders(bookingData?.bookingCode || ''),
    enabled: !!bookingData?.bookingCode,
  });

  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleUpdateStatus = async (order: Order) => {
    const statusOptions = [
      { label: 'Recebido', value: 'RECEIVED' },
      { label: 'Em Andamento', value: 'IN_PROGRESS' },
      { label: 'Concluído', value: 'COMPLETED' },
      { label: 'Cancelado', value: 'CANCELLED' },
    ];

    const currentIndex = statusOptions.findIndex(s => s.value === order.status);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];

    try {
      await updateOrderStatus(order.id, bookingData?.bookingCode || '', nextStatus.value);
      queryClient.invalidateQueries({ queryKey: ['orders', bookingData?.bookingCode] });
      Alert.alert('Status Atualizado', `Pedido alterado para: ${nextStatus.label}`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status do pedido.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const renderOrderCard = (order: Order) => {
    const status = statusConfig[order.status];
    const IconComponent = status.icon;

    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.serviceName}>{order.serviceName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <IconComponent size={12} color="white" />
            <Text style={styles.statusText}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.orderDate}>
            📅 {formatDate(order.date)} às {formatTime(order.time)}
          </Text>
          {order.quantity > 1 && (
            <Text style={styles.orderQuantity}>
              📦 Quantidade: {order.quantity}
            </Text>
          )}
          {order.notes && (
            <Text style={styles.orderNotes}>
              📝 {order.notes}
            </Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderId}>#{order.id}</Text>
          <TouchableOpacity
            style={styles.updateStatusButton}
            onPress={() => handleUpdateStatus(order)}
          >
            <RefreshCw size={14} color="#2563eb" />
            <Text style={styles.updateStatusText}>Atualizar Status</Text>
          </TouchableOpacity>
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
        ) : orders && orders.length > 0 ? (
          <View style={styles.ordersList}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <Text style={styles.refreshButtonText}>
                {refreshing ? 'Atualizando...' : 'Atualizar'}
              </Text>
            </TouchableOpacity>
            {orders.map(renderOrderCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhuma solicitação ainda</Text>
            <Text style={styles.emptySubtitle}>
              Seus pedidos aparecerão aqui quando você solicitar algum serviço
            </Text>
          </View>
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
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
  updateStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    gap: 6,
  },
  updateStatusText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  refreshButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});