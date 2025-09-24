import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Sparkles, 
  ShoppingBag, 
  Settings, 
  LogOut,
  ArrowLeft 
} from 'lucide-react-native';
import { LocalStorage } from '@/lib/storage';

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = new Animated.Value(0);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = await LocalStorage.getAdminToken();
      if (!token || token !== 'ok') {
        router.replace('/');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.replace('/');
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowToast(false);
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair do Admin',
      'Tem certeza que deseja sair da área administrativa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await LocalStorage.setAdminToken('');
              showToastMessage('Sessão de administrador encerrada');
              setTimeout(() => {
                router.replace('/');
              }, 1000);
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Admin Casa Kamará</Text>
          <Text style={styles.subtitle}>Painel Administrativo</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={styles.adminCard}
            onPress={() => router.push('/admin/services')}
          >
            <View style={[styles.cardIcon, { backgroundColor: '#dbeafe' }]}>
              <Sparkles size={32} color="#2563eb" />
            </View>
            <Text style={styles.cardTitle}>Serviços Admin</Text>
            <Text style={styles.cardDescription}>
              Gerenciar serviços, preços e disponibilidade
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.adminCard}
            onPress={() => router.push('/admin/orders')}
          >
            <View style={[styles.cardIcon, { backgroundColor: '#dbeafe' }]}>
              <ShoppingBag size={32} color="#3b82f6" />
            </View>
            <Text style={styles.cardTitle}>Solicitações</Text>
            <Text style={styles.cardDescription}>
              Visualizar e gerenciar solicitações dos hóspedes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.adminCard}
            onPress={() => router.push('/admin/settings')}
          >
            <View style={[styles.cardIcon, { backgroundColor: '#f3e8ff' }]}>
              <Settings size={32} color="#8b5cf6" />
            </View>
            <Text style={styles.cardTitle}>Configurações</Text>
            <Text style={styles.cardDescription}>
              Exportar/importar dados e configurações gerais
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Informações do Sistema</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>• Versão: 1.0.0</Text>
            <Text style={styles.infoText}>• Modo: Desenvolvimento</Text>
            <Text style={styles.infoText}>• Storage: Local (AsyncStorage)</Text>
            <Text style={styles.infoText}>• Última atualização: Hoje</Text>
          </View>
        </View>
      </ScrollView>
      
      {showToast && (
        <Animated.View 
          style={[styles.toast, { opacity: toastOpacity }]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  cardsContainer: {
    padding: 24,
    gap: 16,
  },
  adminCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoSection: {
    padding: 24,
    paddingTop: 0,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});