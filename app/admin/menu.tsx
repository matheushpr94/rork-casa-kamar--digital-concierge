import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Search,
  X,
  Save,
} from 'lucide-react-native';
import { LocalStorage } from '@/lib/storage';

interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  leadTime: string;
  isAvailable: boolean;
  imageUrl?: string;
}

const SEED_MENU: MenuItem[] = [
  {
    id: 'limpeza-extra',
    category: 'Limpeza',
    name: 'Limpeza Extra',
    description: 'Limpeza adicional completa do ambiente',
    price: 80.00,
    unit: 'por limpeza',
    leadTime: '2-4 horas',
    isAvailable: true,
  },
  {
    id: 'limpeza-completa',
    category: 'Limpeza',
    name: 'Limpeza Completa',
    description: 'Limpeza profunda com organização',
    price: 120.00,
    unit: 'por limpeza',
    leadTime: '4-6 horas',
    isAvailable: true,
  },
  {
    id: 'almoco-caseiro',
    category: 'Cozinha',
    name: 'Almoço Caseiro',
    description: 'Refeição completa preparada por chef',
    price: 45.00,
    unit: 'por pessoa',
    leadTime: '2-3 horas',
    isAvailable: true,
  },
  {
    id: 'churrasco-premium',
    category: 'Cozinha',
    name: 'Churrasco Premium',
    description: 'Churrasco completo com acompanhamentos',
    price: 85.00,
    unit: 'por pessoa',
    leadTime: '4-6 horas',
    isAvailable: true,
  },
  {
    id: 'transfer-aeroporto',
    category: 'Transporte',
    name: 'Transfer Aeroporto',
    description: 'Transporte confortável de/para aeroporto',
    price: 120.00,
    unit: 'por trajeto',
    leadTime: '1-2 horas',
    isAvailable: true,
  },
  {
    id: 'passeio-lancha',
    category: 'Transporte',
    name: 'Passeio de Lancha',
    description: 'Passeio exclusivo de lancha',
    price: 300.00,
    unit: 'por grupo',
    leadTime: '24 horas',
    isAvailable: true,
  },
];

export default function AdminMenuScreen() {
  const insets = useSafeAreaInsets();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      const items = await LocalStorage.getAdminMenu();
      if (items.length === 0) {
        await LocalStorage.setAdminMenu(SEED_MENU);
        setMenuItems(SEED_MENU);
      } else {
        setMenuItems(items);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMenuItems = async (items: MenuItem[]) => {
    try {
      await LocalStorage.setAdminMenu(items);
      setMenuItems(items);
    } catch (error) {
      console.error('Error saving menu items:', error);
      Alert.alert('Erro', 'Erro ao salvar item do cardápio');
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      category: 'Limpeza',
      name: '',
      description: '',
      price: 0,
      unit: 'por item',
      leadTime: '1-2 horas',
      isAvailable: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim() || !formData.description?.trim() || !formData.price || formData.price <= 0) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const newItem: MenuItem = {
      id: editingItem?.id || `item_${Date.now()}`,
      category: formData.category || 'Limpeza',
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: formData.price,
      unit: formData.unit || 'por item',
      leadTime: formData.leadTime || '1-2 horas',
      isAvailable: formData.isAvailable ?? true,
      imageUrl: formData.imageUrl,
    };

    let updatedItems: MenuItem[];
    if (editingItem) {
      updatedItems = menuItems.map(item => item.id === editingItem.id ? newItem : item);
    } else {
      updatedItems = [...menuItems, newItem];
    }

    await saveMenuItems(updatedItems);
    setShowModal(false);
    setFormData({});
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const updatedItems = menuItems.map(menuItem => 
      menuItem.id === item.id 
        ? { ...menuItem, isAvailable: !menuItem.isAvailable }
        : menuItem
    );
    await saveMenuItems(updatedItems);
  };

  const handleDelete = (item: MenuItem) => {
    Alert.alert(
      'Excluir Item',
      `Tem certeza que deseja excluir "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const updatedItems = menuItems.filter(menuItem => menuItem.id !== item.id);
            await saveMenuItems(updatedItems);
          },
        },
      ]
    );
  };

  const handleRestoreSeed = () => {
    Alert.alert(
      'Restaurar Cardápio',
      'Isso irá substituir todo o cardápio atual pelos itens padrão. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            await saveMenuItems(SEED_MENU);
          },
        },
      ]
    );
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMenuItem = (item: MenuItem) => (
    <View key={item.id} style={styles.menuItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
        <View style={styles.itemActions}>
          <Switch
            value={item.isAvailable}
            onValueChange={() => handleToggleAvailability(item)}
            trackColor={{ false: '#e5e7eb', true: '#10b981' }}
            thumbColor={item.isAvailable ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </View>
      
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemPrice}>
          R$ {item.price.toFixed(2)} {item.unit}
        </Text>
        <Text style={styles.itemLeadTime}>{item.leadTime}</Text>
      </View>
      
      <View style={styles.itemButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Edit3 size={16} color="#3b82f6" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Trash2 size={16} color="#ef4444" />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando cardápio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar itens..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Novo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.restoreButton} onPress={handleRestoreSeed}>
            <RotateCcw size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery ? 'Nenhum item encontrado' : 'Nenhum item no cardápio'}
          </Text>
        ) : (
          filteredItems.map(renderMenuItem)
        )}
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Editar Item' : 'Novo Item'}
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nome *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.name || ''}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Nome do item"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Categoria</Text>
              <TextInput
                style={styles.formInput}
                value={formData.category || ''}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="Categoria"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Descrição *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={formData.description || ''}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Descrição do item"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>Preço (R$) *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.price?.toString() || ''}
                  onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.formLabel}>Unidade</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.unit || ''}
                  onChangeText={(text) => setFormData({ ...formData, unit: text })}
                  placeholder="por item"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Prazo de Entrega</Text>
              <TextInput
                style={styles.formInput}
                value={formData.leadTime || ''}
                onChangeText={(text) => setFormData({ ...formData, leadTime: text })}
                placeholder="1-2 horas"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>URL da Imagem</Text>
              <TextInput
                style={styles.formInput}
                value={formData.imageUrl || ''}
                onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                placeholder="https://..."
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.formLabel}>Disponível</Text>
              <Switch
                value={formData.isAvailable ?? true}
                onValueChange={(value) => setFormData({ ...formData, isAvailable: value })}
                trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                thumbColor={formData.isAvailable ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Save size={20} color="white" />
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
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
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  restoreButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  itemActions: {
    marginLeft: 16,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  itemLeadTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  editButtonText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 40,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 40,
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
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});