import { Tabs } from "expo-router";
import React, { useState } from "react";
import { 
  View, 
  TouchableOpacity, 
  Modal, 
  Text, 
  StyleSheet,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Home, ShoppingBag, FileText, Utensils, ChefHat, User, LogOut, Sparkles } from "lucide-react-native";
import { LocalStorage } from "@/lib/storage";
import * as Haptics from 'expo-haptics';

export default function TabLayout() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const showSuccessToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else if (Platform.OS === 'web') {
      // For web, we could implement a custom toast, but Alert works for now
      console.log(message);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await LocalStorage.clearGuestData();
      setShowLogoutModal(false);
      showSuccessToast('Você saiu da sessão');
      
      // Small delay to show the toast before navigation
      setTimeout(() => {
        router.replace('/');
      }, 100);
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Erro', 'Erro ao sair da sessão');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setShowLogoutModal(true);
  };

  const LogoutButton = () => (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={handleLogoutPress}
      testID="logout-button"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Menu do usuário"
    >
      <User size={24} color="#6b7280" />
    </TouchableOpacity>
  );

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#9ca3af',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#1f2937',
          },
          headerRight: () => <LogoutButton />,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
        }}
      >
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Serviços",
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Minhas Solicitações",
          tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="manual"
        options={{
          title: "House Manual",
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Cardápio",
          tabBarIcon: ({ color, size }) => <ChefHat color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: "Refeições",
          tabBarIcon: ({ color, size }) => <Utensils color={color} size={size} />,
        }}
      />
      </Tabs>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <LogOut size={32} color="#ef4444" />
            </View>
            <Text style={styles.modalTitle}>Sair da sessão</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja sair? Seus dados serão removidos do dispositivo.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, isLoggingOut && styles.confirmButtonDisabled]}
                onPress={handleLogout}
                disabled={isLoggingOut}
                accessibilityRole="button"
                accessibilityLabel="Confirmar logout"
              >
                <Text style={[styles.confirmButtonText, isLoggingOut && styles.confirmButtonTextDisabled]}>
                  {isLoggingOut ? 'Saindo...' : 'Sair'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: 8,
    marginRight: 16,
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
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  confirmButtonTextDisabled: {
    color: '#f3f4f6',
  },
});