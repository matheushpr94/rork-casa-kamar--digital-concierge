import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Sparkles, 
  ShoppingBag, 
  FileText, 
  ChefHat,
  Utensils,
  ArrowRight,
} from 'lucide-react-native';
import { useBooking } from '@/contexts/booking-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const quickActions = [
  {
    id: 'services',
    title: 'Serviços',
    subtitle: 'Solicite limpeza, transporte e mais',
    icon: Sparkles,
    route: '/services',
    color: '#2563eb',
  },
  {
    id: 'orders',
    title: 'Minhas Solicitações',
    subtitle: 'Acompanhe seus pedidos',
    icon: ShoppingBag,
    route: '/orders',
    color: '#10b981',
  },
  {
    id: 'manual',
    title: 'House Manual',
    subtitle: 'Guia da propriedade',
    icon: FileText,
    route: '/manual',
    color: '#f59e0b',
  },
  {
    id: 'menu',
    title: 'Cardápio',
    subtitle: 'Explore opções gastronômicas',
    icon: ChefHat,
    route: '/menu',
    color: '#8b5cf6',
  },
  {
    id: 'meals',
    title: 'Refeições Inclusas',
    subtitle: 'Gerencie suas refeições',
    icon: Utensils,
    route: '/meals',
    color: '#ef4444',
  },
];

export default function HomeScreen() {
  const { bookingData } = useBooking();

  const handleActionPress = (route: string) => {
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
        <Text style={styles.subtitle}>Como podemos ajudá-lo hoje?</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            
            return (
              <TouchableOpacity
                key={action.id}
                onPress={() => handleActionPress(action.route)}
                testID={`action-${action.id}`}
              >
                <Card style={styles.actionCard}>
                  <View style={styles.actionContent}>
                    <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                      <IconComponent size={24} color={action.color} />
                    </View>
                    <View style={styles.actionText}>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                    </View>
                    <ArrowRight size={20} color="#9ca3af" />
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.welcomeSection}>
          <Card style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Bem-vindo à sua estadia!</Text>
            <Text style={styles.welcomeText}>
              Estamos aqui para tornar sua experiência inesquecível. 
              Use os serviços disponíveis ou consulte o manual da propriedade para mais informações.
            </Text>
            <Button
              title="Ver Serviços Disponíveis"
              onPress={() => handleActionPress('/services')}
              variant="primary"
              style={styles.welcomeButton}
            />
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
  quickActions: {
    padding: 16,
    gap: 12,
  },
  actionCard: {
    marginBottom: 4,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  welcomeSection: {
    padding: 16,
    paddingTop: 8,
  },
  welcomeCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  welcomeButton: {
    marginTop: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 40,
  },
});