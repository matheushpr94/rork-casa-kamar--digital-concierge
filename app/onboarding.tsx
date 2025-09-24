import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Home, User } from 'lucide-react-native';
import { verifyBooking } from '@/lib/api';
import { useBooking } from '@/contexts/booking-context';

export default function OnboardingScreen() {
  const [bookingCode, setBookingCode] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setBookingData } = useBooking();
  const insets = useSafeAreaInsets();

  const handleConfirm = async () => {
    if (!bookingCode.trim() || !guestLastName.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const bookingData = await verifyBooking(bookingCode.trim(), guestLastName.trim());
      setBookingData(bookingData);
      router.replace('/(tabs)/home');
    } catch {
      setError('Código de reserva ou sobrenome incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Home size={48} color="#2563eb" />
            </View>
            <Text style={styles.title}>Bem-vindo à Casa Kamará</Text>
            <Text style={styles.subtitle}>
              Seu concierge digital para uma estadia perfeita
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Código da Reserva</Text>
              <TextInput
                style={styles.input}
                value={bookingCode}
                onChangeText={setBookingCode}
                placeholder="Ex: AZ123456"
                autoCapitalize="characters"
                autoCorrect={false}
                testID="booking-code-input"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sobrenome do Hóspede</Text>
              <TextInput
                style={styles.input}
                value={guestLastName}
                onChangeText={setGuestLastName}
                placeholder="Seu sobrenome"
                autoCapitalize="words"
                autoCorrect={false}
                testID="guest-name-input"
              />
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={loading}
              testID="confirm-button"
            >
              <User size={20} color="white" />
              <Text style={styles.confirmButtonText}>
                {loading ? 'Verificando...' : 'Confirmar Check-in'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Use o código &quot;AZ123456&quot; e sobrenome &quot;Silva&quot; para testar
            </Text>
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 8,
  },
});