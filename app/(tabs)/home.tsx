import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Clock,
  ChefHat,
  TrendingUp,
  FileText,
  ArrowRight,
} from 'lucide-react-native';
import { useBooking } from '@/contexts/booking-context';
import { Card, Badge, SkeletonItemList, EmptyState } from '@/components/ui';
import { requestsRepo, servicesRepo, menuRepo } from '@/lib/repositories';
import { ServiceRequest } from '@/lib/ports/requests.port';
import { Service } from '@/lib/ports/services.port';
import { MenuItem } from '@/lib/ports/menu.port';

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'received': return 'Recebido';
    case 'in_progress': return 'Em andamento';
    case 'done': return 'Concluído';
    case 'canceled': return 'Cancelado';
    default: return status;
  }
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Agora há pouco';
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  
  return date.toLocaleDateString('pt-BR');
};

const formatPrice = (price: number) => {
  if (typeof price !== 'number' || isNaN(price) || price < 0) {
    return 'R$ 0,00';
  }
  
  // Validate price range to prevent formatting issues
  const validatedPrice = Math.min(Math.max(price, 0), 999999.99);
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(validatedPrice);
};

const getStatusVariant = (status: string): 'neutral' | 'indigo' | 'emerald' | 'rose' => {
  switch (status) {
    case 'pending': return 'neutral';
    case 'received':
    case 'in_progress': return 'indigo';
    case 'done': return 'emerald';
    case 'canceled': return 'rose';
    default: return 'neutral';
  }
};

export default function HomeScreen() {
  const { bookingData } = useBooking();
  const [recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [servicesWithRequests, setServicesWithRequests] = useState<{ [key: string]: Service }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [requestsData, servicesData, menuData] = await Promise.all([
        requestsRepo.listByUser('mock-user'),
        servicesRepo.list(),
        menuRepo.listItems()
      ]);

      // Get recent requests (last 3)
      const sortedRequests = requestsData
        .filter(r => r.status !== 'canceled')
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 3);
      
      setRecentRequests(sortedRequests);
      setServices(servicesData.slice(0, 3)); // Top 3 services
      setMenuItems(menuData.slice(0, 3)); // Top 3 menu items

      // Create a map of services for quick lookup
      const servicesMap = servicesData.reduce((acc, service) => {
        acc[service.id] = service;
        return acc;
      }, {} as { [key: string]: Service });
      setServicesWithRequests(servicesMap);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (route: string) => {
    router.push(route as any);
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
        <Text style={styles.subtitle}>Bem-vindo ao seu dashboard</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recent Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Solicitações em Andamento</Text>
          </View>
          
          {isLoading ? (
            <SkeletonItemList count={2} />
          ) : recentRequests.length > 0 ? (
            <View style={styles.requestsList}>
              {recentRequests.map((request) => {
                const service = servicesWithRequests[request.serviceId];
                return (
                  <Card key={request.id} style={styles.requestCard}>
                    <View style={styles.requestContent}>
                      <View style={styles.requestInfo}>
                        <Text style={styles.requestServiceName}>
                          {service?.name || 'Serviço não encontrado'}
                        </Text>
                        <Text style={styles.requestDate}>
                          {formatDate(request.createdAt)}
                        </Text>
                        {request.note && (
                          <Text style={styles.requestNote} numberOfLines={1}>
                            {request.note}
                          </Text>
                        )}
                      </View>
                      <Badge 
                        label={getStatusLabel(request.status)}
                        variant={getStatusVariant(request.status)}
                      />
                    </View>
                  </Card>
                );
              })}
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => handleNavigate('/(tabs)/orders')}
              >
                <Text style={styles.viewAllText}>Ver todas</Text>
                <ArrowRight size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          ) : (
            <EmptyState 
              title="Nenhuma solicitação em andamento"
              subtitle="Você não tem solicitações ativas no momento"
            />
          )}
        </View>

        {/* Menu Highlights Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ChefHat size={20} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>Destaques do Cardápio</Text>
          </View>
          
          {isLoading ? (
            <SkeletonItemList count={2} />
          ) : menuItems.length > 0 ? (
            <View style={styles.menuList}>
              {menuItems.map((item) => (
                <Card key={item.id} style={styles.menuCard}>
                  <View style={styles.menuContent}>
                    <View style={styles.menuInfo}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuPrice}>{formatPrice(item.price)}</Text>
                      {item.description && (
                        <Text style={styles.menuDescription} numberOfLines={2}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                    <Badge 
                      label={item.available ? 'Disponível' : 'Indisponível'}
                      variant={item.available ? 'emerald' : 'neutral'}
                    />
                  </View>
                </Card>
              ))}
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => handleNavigate('/(tabs)/menu')}
              >
                <Text style={styles.viewAllText}>Explorar cardápio</Text>
                <ArrowRight size={16} color="#8b5cf6" />
              </TouchableOpacity>
            </View>
          ) : (
            <EmptyState 
              title="Cardápio em breve"
              subtitle="Estamos preparando opções especiais para você"
            />
          )}
        </View>

        {/* Popular Services Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#10b981" />
            <Text style={styles.sectionTitle}>Serviços Mais Pedidos</Text>
          </View>
          
          {isLoading ? (
            <SkeletonItemList count={3} />
          ) : (
            <View style={styles.servicesList}>
              {services.map((service) => (
                <Card key={service.id} style={styles.serviceCard}>
                  <View style={styles.serviceContent}>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceTitle}>{service.name}</Text>
                      <Text style={styles.servicePrice}>{formatPrice(service.price || 0)}</Text>
                      {service.description && (
                        <Text style={styles.serviceDescription} numberOfLines={2}>
                          {service.description}
                        </Text>
                      )}
                      {service.durationMin && (
                        <Text style={styles.serviceDuration}>
                          Duração: {Math.floor(service.durationMin / 60)}h {service.durationMin % 60}min
                        </Text>
                      )}
                    </View>
                  </View>
                </Card>
              ))}
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => handleNavigate('/(tabs)/services')}
              >
                <Text style={styles.viewAllText}>Ver serviços</Text>
                <ArrowRight size={16} color="#10b981" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* House Manual Section */}
        <View style={styles.section}>
          <Card style={styles.manualCard}>
            <View style={styles.manualContent}>
              <View style={styles.manualIcon}>
                <FileText size={24} color="#f59e0b" />
              </View>
              <View style={styles.manualInfo}>
                <Text style={styles.manualTitle}>House Manual</Text>
                <Text style={styles.manualSubtitle}>
                  Informações importantes sobre a propriedade
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.manualButton}
                onPress={() => handleNavigate('/(tabs)/manual')}
              >
                <Text style={styles.manualButtonText}>Abrir</Text>
                <ArrowRight size={16} color="#f59e0b" />
              </TouchableOpacity>
            </View>
          </Card>
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  requestsList: {
    gap: 8,
  },
  requestCard: {
    marginBottom: 4,
  },
  requestContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  requestInfo: {
    flex: 1,
    marginRight: 12,
  },
  requestServiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  requestDate: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  requestNote: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  menuList: {
    gap: 8,
  },
  menuCard: {
    marginBottom: 4,
  },
  menuContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  servicesList: {
    gap: 8,
  },
  serviceCard: {
    marginBottom: 4,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 12,
    color: '#64748b',
  },
  manualCard: {
    backgroundColor: '#fffbeb',
    borderColor: '#fbbf24',
  },
  manualContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manualIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  manualInfo: {
    flex: 1,
  },
  manualTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  manualSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  manualButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f59e0b',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 40,
  },
});