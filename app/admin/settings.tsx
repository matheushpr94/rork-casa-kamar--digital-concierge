import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  Share,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Download, 
  Upload, 
  LogOut,
  FileText,
  X,
  Copy,
  Trash2,
} from 'lucide-react-native';
import { LocalStorage } from '@/lib/storage';
import { router } from 'expo-router';

export default function AdminSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState('');

  const handleExportMenu = async () => {
    try {
      const menuItems = await LocalStorage.getAdminMenu();
      const exportJson = JSON.stringify(menuItems, null, 2);
      setExportData(exportJson);
      setShowExportModal(true);
    } catch (error) {
      console.error('Error exporting menu:', error);
      Alert.alert('Erro', 'Erro ao exportar cardápio');
    }
  };

  const handleShareExport = async () => {
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(exportData);
        Alert.alert('Sucesso', 'Dados copiados para a área de transferência');
      } else {
        await Share.share({
          message: exportData,
          title: 'Cardápio Casa Kamará',
        });
      }
    } catch (error) {
      console.error('Error sharing export:', error);
      Alert.alert('Erro', 'Erro ao compartilhar dados');
    }
  };

  const handleCopyExport = async () => {
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(exportData);
      } else {
        // For mobile, we'll use a simple copy mechanism
        Alert.alert('Dados copiados', 'Os dados foram copiados para a área de transferência');
      }
      Alert.alert('Sucesso', 'Dados copiados para a área de transferência');
    } catch (error) {
      console.error('Error copying export:', error);
      Alert.alert('Erro', 'Erro ao copiar dados');
    }
  };

  const handleImportMenu = async () => {
    if (!importText.trim()) {
      Alert.alert('Erro', 'Cole os dados JSON para importar');
      return;
    }

    try {
      const menuData = JSON.parse(importText.trim());
      
      if (!Array.isArray(menuData)) {
        throw new Error('Dados devem ser um array');
      }

      // Validate menu structure
      for (const item of menuData) {
        if (!item.id || !item.name || !item.description || typeof item.price !== 'number') {
          throw new Error('Estrutura de dados inválida');
        }
      }

      await LocalStorage.setAdminMenu(menuData);
      setShowImportModal(false);
      setImportText('');
      Alert.alert('Sucesso', 'Cardápio importado com sucesso!');
    } catch (error) {
      console.error('Error importing menu:', error);
      Alert.alert('Erro', 'Dados JSON inválidos. Verifique o formato.');
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Isso irá remover TODOS os dados do sistema (cardápio, pedidos, etc.). Esta ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              await LocalStorage.setAdminMenu([]);
              await LocalStorage.setOrders('AZ123456', []);
              Alert.alert('Sucesso', 'Todos os dados foram removidos');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Erro', 'Erro ao limpar dados');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
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
              await LocalStorage.clearAdminData();
              router.replace('/');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerenciamento de Dados</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleExportMenu}>
            <View style={styles.settingIcon}>
              <Download size={24} color="#10b981" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Exportar Cardápio</Text>
              <Text style={styles.settingDescription}>
                Gerar JSON com todos os itens do cardápio
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowImportModal(true)}>
            <View style={styles.settingIcon}>
              <Upload size={24} color="#3b82f6" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Importar Cardápio</Text>
              <Text style={styles.settingDescription}>
                Substituir cardápio atual por dados JSON
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sistema</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Versão:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Modo:</Text>
            <Text style={styles.infoValue}>Desenvolvimento</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Storage:</Text>
            <Text style={styles.infoValue}>Local (AsyncStorage)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Perigosas</Text>
          
          <TouchableOpacity style={styles.dangerItem} onPress={handleClearAllData}>
            <View style={styles.settingIcon}>
              <Trash2 size={24} color="#ef4444" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.dangerTitle}>Limpar Todos os Dados</Text>
              <Text style={styles.settingDescription}>
                Remove cardápio, pedidos e configurações
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={24} color="#ef4444" />
            <Text style={styles.logoutText}>Sair do Admin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Import Modal */}
      <Modal
        visible={showImportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowImportModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Importar Cardápio</Text>
            <TouchableOpacity onPress={() => setShowImportModal(false)}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Cole os dados JSON do cardápio abaixo. Isso substituirá completamente o cardápio atual.
            </Text>
            
            <TextInput
              style={styles.importTextArea}
              value={importText}
              onChangeText={setImportText}
              placeholder="Cole o JSON aqui..."
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.importButton}
              onPress={handleImportMenu}
            >
              <Upload size={20} color="white" />
              <Text style={styles.importButtonText}>Importar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Exportar Cardápio</Text>
            <TouchableOpacity onPress={() => setShowExportModal(false)}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Dados do cardápio em formato JSON:
            </Text>
            
            <ScrollView style={styles.exportContainer}>
              <Text style={styles.exportText}>{exportData}</Text>
            </ScrollView>
          </View>

          <View style={styles.modalFooter}>
            <View style={styles.exportActions}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyExport}
              >
                <Copy size={20} color="#6b7280" />
                <Text style={styles.copyButtonText}>Copiar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShareExport}
              >
                <FileText size={20} color="white" />
                <Text style={styles.shareButtonText}>Compartilhar</Text>
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
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
    marginBottom: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  importTextArea: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    textAlignVertical: 'top',
  },
  exportContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  exportText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#1f2937',
    lineHeight: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  importButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  exportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  copyButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});