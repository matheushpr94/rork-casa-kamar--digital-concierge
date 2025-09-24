import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Package,
} from 'lucide-react-native';
import { LocalStorage } from '@/lib/storage';
import type { Order } from '@/types/api';

const STATUS_CONFIG = {
  RECEIVED: {
    label: 'Recebido',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    icon: Package,
    nextStatus: 'IN_PROGRESS',
    nextLabel: 'Iniciar',
  },
  IN_PROGRESS: {
    label: 'Em andamento',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    icon: Clock,
    nextStatus: 'COMPLETED',
    nextLabel: 'Concluir',
  },
  COMPLETED: {
    label: 'Concluído',
    color: '#10b981',
    bgColor: '#f0fdf4',
    icon: CheckCircle,
    nextStatus: 'CANCELLED',
    nextLabel: 'Cancelar',
  },
  CANCELLED: {
    label: 'Cancelado',
    color: '#ef4444',
    bgColor: '#fef2f2',
    icon: XCircle,
    nextStatus: 'RECEIVED',
    nextLabel: 'Reativar',
  },
};

export default function AdminOrdersScreen() {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const guestOrders = await LocalStorage.getOrders('AZ123456');
      setOrders(guestOrders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const updateOrderStatus = async (order: Order, newStatus: string) => {
    try {
      const updatedOrders = orders.map(o => 
        o.id === order.id ? { ...o, status: newStatus as Order['status'] } : o
      );
      await LocalStorage.setOrders('AZ123456', updatedOrders);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Erro', 'Erro ao atualizar status do pedido');
    }
  };

  const handleStatusChange = (order: Order) => {
    const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
    if (!config) return;

    Alert.alert(
      'Alterar Status',
      `Alterar status de "${order.serviceName}" para "${STATUS_CONFIG[config.nextStatus as keyof typeof STATUS_CONFIG]?.label}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: config.nextLabel,
          onPress: () => updateOrderStatus(order, config.nextStatus),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderOrder = (order: Order) => {
    const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>{order.serviceName}</Text>
            <Text style={styles.orderId}>#{order.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
            <IconComponent size={16} color={config.color} />
            <Text style={[styles.statusText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data do serviço:</Text>
            <Text style={styles.detailValue}>
              {order.date} às {order.time}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantidade:</Text>
            <Text style={styles.detailValue}>{order.quantity}</Text>
          </View>
          
          {order.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Observações:</Text>
              <Text style={styles.detailValue}>{order.notes}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Criado em:</Text>
            <Text style={styles.detailValue}>{formatDate(order.createdAt)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: config.bgColor }]}
          onPress={() => handleStatusChange(order)}
        >
          <Text style={[styles.actionButtonText, { color: config.color }]}>
            {config.nextLabel}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando pedidos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Pedidos dos Hóspedes</Text>
          <Text style={styles.subtitle}>
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <RefreshCw size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Os pedidos dos hóspedes aparecerão aqui
            </Text>
          </View>
        ) : (
          orders.map(renderOrder)
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});