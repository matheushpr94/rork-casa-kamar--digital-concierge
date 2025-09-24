import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users, Shield, X } from 'lucide-react-native';
import { useBooking } from '@/contexts/booking-context';
import { LocalStorage } from '@/lib/storage';

export default function ProfileSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { clearBookingData, bookingData, isLoading: bookingLoading } = useBooking();
  const [isLoading, setIsLoading] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    checkAdminToken();
  }, []);

  const checkAdminToken = async () => {
    try {
      const token = await LocalStorage.getAdminToken();
      setAdminToken(token);
    } catch (error) {
      console.error('Error checking admin token:', error);
    }
  };

  const handleGuestAccess = () => {
    if (bookingData) {
      router.replace('/(tabs)/home');
    } else {
      router.push('/onboarding');
    }
  };

  const handleAdminAccess = async () => {
    if (adminToken === 'ok') {
      router.replace('/admin');
      return;
    }

    setShowPinModal(true);
  };

  const handlePinSubmit = async () => {
    if (!pin.trim()) {
      Alert.alert('Erro', 'Digite o PIN');
      return;
    }

    setPinLoading(true);
    
    if (pin === 'ADMIN2025') {
      try {
        await LocalStorage.setAdminToken('ok');
        setAdminToken('ok');
        setShowPinModal(false);
        setPin('');
        router.replace('/admin');
      } catch (error) {
        console.error('Error saving admin token:', error);
        Alert.alert('Erro', 'Erro ao salvar token de administrador');
      }
    } else {
      Alert.alert('Erro', 'PIN incorreto');
    }
    
    setPinLoading(false);
  };

  const handlePinCancel = () => {
    setShowPinModal(false);
    setPin('');
    setPinLoading(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await clearBookingData();
    await LocalStorage.setAdminToken('');
    setAdminToken(null);
    setIsLoading(false);
    Alert.alert('Sucesso', 'Dados limpos com sucesso!');
  };

  if (bookingLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.content}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Casa Kamará</Text>
          <Text style={styles.subtitle}>Concierge Digital</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.guestButton} onPress={handleGuestAccess}>
            <Users size={32} color="white" />
            <Text style={styles.buttonTitle}>Sou Hóspede</Text>
            <Text style={styles.buttonSubtitle}>
              {bookingData ? 'Acessar serviços' : 'Fazer check-in'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.adminButton} onPress={handleAdminAccess}>
            <Shield size={32} color="white" />
            <Text style={styles.buttonTitle}>Sou Anfitrião</Text>
            <Text style={styles.buttonSubtitle}>
              {adminToken === 'ok' ? 'Acessar admin' : 'Login administrativo'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={styles.logoutText}>
            {isLoading ? 'Limpando...' : 'Limpar dados e sair'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPinModal}
        transparent
        animationType="fade"
        onRequestClose={handlePinCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Acesso Administrativo</Text>
              <TouchableOpacity 
                onPress={handlePinCancel}
                style={styles.closeButton}
                disabled={pinLoading}
              >
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>Digite o PIN de administrador:</Text>
            
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="PIN"
              secureTextEntry
              autoFocus={Platform.OS !== 'web'}
              maxLength={20}
              editable={!pinLoading}
              onSubmitEditing={handlePinSubmit}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handlePinCancel}
                disabled={pinLoading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]} 
                onPress={handlePinSubmit}
                disabled={pinLoading}
              >
                <Text style={styles.submitButtonText}>
                  {pinLoading ? 'Verificando...' : 'Entrar'}
                </Text>
              </TouchableOpacity>
            </View>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  guestButton: {
    backgroundColor: '#2563eb',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminButton: {
    backgroundColor: '#7c3aed',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  logoutButton: {
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  pinInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#f9fafb',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  submitButton: {
    backgroundColor: '#7c3aed',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
});