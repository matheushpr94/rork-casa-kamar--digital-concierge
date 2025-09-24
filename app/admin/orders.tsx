import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Package,
} from 'lucide-react-native';
import { requestsRepo, servicesRepo } from '@/lib/repositories';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ServiceRequest } from '@/lib/ports/requests.port';

const STATUS_CONFIG = {
  pending: {
    label: 'Pendente',
    color: '#6b7280',
    bgColor: '#f3f4f6',
    icon: Clock,
    nextStatus: 'received' as const,
    nextLabel: 'Receber',
  },
  received: {
    label: 'Recebido',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    icon: Package,
    nextStatus: 'in_progress' as const,
    nextLabel: 'Iniciar',
  },
  in_progress: {
    label: 'Em andamento',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    icon: Clock,
    nextStatus: 'done' as const,
    nextLabel: 'Concluir',
  },
  done: {
    label: 'Concluído',
    color: '#10b981',
    bgColor: '#f0fdf4',
    icon: CheckCircle,
    nextStatus: 'canceled' as const,
    nextLabel: 'Cancelar',
  },
  canceled: {
    label: 'Cancelado',
    color: '#ef4444',
    bgColor: '#fef2f2',
    icon: XCircle,
    nextStatus: 'pending' as const,
    nextLabel: 'Reativar',
  },
};

export default function AdminOrdersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: () => requestsRepo.adminList(),
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

  const updateOrderStatus = async (request: ServiceRequest, newStatus: string) => {
    try {
      await requestsRepo.updateStatus(request.id, newStatus as any);
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
    } catch (error) {
      console.error('Error updating request status:', error);
      Alert.alert('Erro', 'Erro ao atualizar status da solicitação');
    }
  };

  const handleStatusChange = (request: ServiceRequest) => {
    const config = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
    if (!config) return;

    const service = services?.find(s => s.id === request.serviceId);
    const serviceName = service?.name || 'Serviço';

    Alert.alert(
      'Alterar Status',
      `Alterar status de "${serviceName}" para "${STATUS_CONFIG[config.nextStatus as keyof typeof STATUS_CONFIG]?.label}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: config.nextLabel,
          onPress: () => updateOrderStatus(request, config.nextStatus),
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderRequest = (request: ServiceRequest) => {
    const config = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
    if (!config) return null;

    const IconComponent = config.icon;
    const service = services?.find(s => s.id === request.serviceId);

    return (
      <View key={request.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>{service?.name || 'Serviço Solicitado'}</Text>
            <Text style={styles.orderId}>#{request.id}</Text>
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
            <Text style={styles.detailLabel}>Usuário:</Text>
            <Text style={styles.detailValue}>{request.userId}</Text>
          </View>
          
          {request.note && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Observações:</Text>
              <Text style={styles.detailValue}>{request.note}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Criado em:</Text>
            <Text style={styles.detailValue}>{formatDate(request.createdAt)}</Text>
          </View>
          
          {request.updatedAt && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Atualizado em:</Text>
              <Text style={styles.detailValue}>{formatDate(request.updatedAt)}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: config.bgColor }]}
          onPress={() => handleStatusChange(request)}
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
          <Text style={styles.loadingText}>Carregando solicitações...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Solicitações dos Hóspedes</Text>
          <Text style={styles.subtitle}>
            {requests?.length || 0} {(requests?.length || 0) === 1 ? 'solicitação' : 'solicitações'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <RefreshCw size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {!requests || requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nenhuma solicitação encontrada</Text>
            <Text style={styles.emptySubtitle}>
              As solicitações dos hóspedes aparecerão aqui
            </Text>
          </View>
        ) : (
          requests.map(renderRequest)
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