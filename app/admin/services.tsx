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
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  X,
  Save,
} from 'lucide-react-native';
import { servicesRepoMockAdmin } from '@/lib/adapters/mock/services.adapter';
import type { Service, ServiceVariant } from '@/lib/ports/services.port';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SkeletonItemList } from '@/components/ui/SkeletonItemList';
import { EmptyState } from '@/components/ui/EmptyState';



export default function AdminServicesScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [variants, setVariants] = useState<ServiceVariant[]>([]);
  
  const queryClient = useQueryClient();
  
  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: servicesRepoMockAdmin.list,
  });



  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      durationMin: 60,
      available: true,
      active: true,
      order: (services?.length || 0) + 1,
    });
    setVariants([]);
    setShowModal(true);
  };

  const handleEdit = (item: Service) => {
    setEditingItem(item);
    setFormData({ ...item });
    setVariants(item.variants || []);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim() || !formData.description?.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const serviceData: Partial<Service> = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        variants: variants.length > 0 ? variants : undefined,
      };

      if (editingItem) {
        await servicesRepoMockAdmin.update(editingItem.id, serviceData);
      } else {
        await servicesRepoMockAdmin.create(serviceData as Omit<Service, 'id'>);
      }
      
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setShowModal(false);
      setFormData({});
      setVariants([]);
    } catch (error) {
      console.error('Error saving service:', error);
      Alert.alert('Erro', 'Erro ao salvar serviço');
    }
  };

  const handleToggleActive = async (item: Service) => {
    try {
      await servicesRepoMockAdmin.update(item.id, { active: !item.active });
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    } catch (error) {
      console.error('Error updating service:', error);
      Alert.alert('Erro', 'Erro ao atualizar serviço');
    }
  };

  const handleDelete = (item: Service) => {
    Alert.alert(
      'Desativar Serviço',
      `Tem certeza que deseja desativar "${item.name}"? Ele não aparecerá mais para os hóspedes.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: async () => {
            try {
              await servicesRepoMockAdmin.update(item.id, { active: false });
              queryClient.invalidateQueries({ queryKey: ['admin-services'] });
              queryClient.invalidateQueries({ queryKey: ['services'] });
            } catch (error) {
              console.error('Error deactivating service:', error);
              Alert.alert('Erro', 'Erro ao desativar serviço');
            }
          },
        },
      ]
    );
  };



  const filteredItems = (services || []).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const addVariant = () => {
    const newVariant: ServiceVariant = {
      id: `variant_${Date.now()}`,
      name: '',
      price: 0,
    };
    setVariants([...variants, newVariant]);
  };
  
  const updateVariant = (index: number, field: keyof ServiceVariant, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };
  
  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const renderServiceItem = (item: Service) => (
    <Card key={item.id} style={styles.serviceItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={[styles.itemStatus, { color: item.active ? '#10b981' : '#ef4444' }]}>
            {item.active ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
        <View style={styles.itemActions}>
          <Switch
            value={item.active || false}
            onValueChange={() => handleToggleActive(item)}
            trackColor={{ false: '#e5e7eb', true: '#10b981' }}
            thumbColor={item.active ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </View>
      
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemPrice}>
          {item.variants && item.variants.length > 0 
            ? `A partir de R$ ${Math.min(...item.variants.map(v => v.price)).toFixed(2)}`
            : item.price ? `R$ ${item.price.toFixed(2)}` : 'Consultar'
          }
        </Text>
        {item.durationMin && (
          <Text style={styles.itemLeadTime}>
            {item.durationMin < 60 ? `${item.durationMin} min` : 
             `${Math.floor(item.durationMin / 60)}h${item.durationMin % 60 ? ` ${item.durationMin % 60}min` : ''}`}
          </Text>
        )}
      </View>
      
      {item.variants && item.variants.length > 0 && (
        <View style={styles.variantsInfo}>
          <Text style={styles.variantsLabel}>Variantes:</Text>
          {item.variants.map((variant, index) => (
            <Text key={variant.id} style={styles.variantText}>
              • {variant.name} - R$ {variant.price.toFixed(2)}
            </Text>
          ))}
        </View>
      )}
      
      <View style={styles.itemButtons}>
        <Button
          title="Editar"
          onPress={() => handleEdit(item)}
          variant="outline"
          style={styles.editButton}
        />
        
        <Button
          title="Desativar"
          onPress={() => handleDelete(item)}
          variant="danger"
          style={styles.deleteButton}
        />
      </View>
    </Card>
  );



  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Serviços Admin</Text>
        <Text style={styles.pageSubtitle}>Gerencie os serviços disponíveis</Text>
      </View>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar serviços..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.headerActions}>
          <Button
            title="Novo Serviço"
            onPress={handleAddNew}
            variant="primary"
            style={styles.addButton}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <SkeletonItemList count={6} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title={searchQuery ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
            subtitle={searchQuery ? 'Tente uma busca diferente' : 'Adicione o primeiro serviço'}
            icon={<Plus size={48} color="#6b7280" />}
          />
        ) : (
          <View style={styles.servicesList}>
            {filteredItems.map(renderServiceItem)}
          </View>
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
              {editingItem ? 'Editar Serviço' : 'Novo Serviço'}
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
                placeholder="Nome do serviço"
              />
            </View>



            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Descrição *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={formData.description || ''}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Descrição do serviço"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>Preço Base (R$)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.price?.toString() || ''}
                  onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.formLabel}>Duração (min)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.durationMin?.toString() || ''}
                  onChangeText={(text) => setFormData({ ...formData, durationMin: parseInt(text) || 0 })}
                  placeholder="60"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Ordem de Exibição</Text>
              <TextInput
                style={styles.formInput}
                value={formData.order?.toString() || ''}
                onChangeText={(text) => setFormData({ ...formData, order: parseInt(text) || 0 })}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.variantsHeader}>
                <Text style={styles.formLabel}>Variantes do Serviço</Text>
                <Button
                  title="Adicionar Variante"
                  onPress={addVariant}
                  variant="outline"
                  style={styles.addVariantButton}
                />
              </View>
              
              {variants.map((variant, index) => (
                <View key={variant.id} style={styles.variantForm}>
                  <View style={styles.variantRow}>
                    <TextInput
                      style={[styles.formInput, { flex: 1, marginRight: 8 }]}
                      value={variant.name}
                      onChangeText={(text) => updateVariant(index, 'name', text)}
                      placeholder="Nome da variante"
                    />
                    <TextInput
                      style={[styles.formInput, { flex: 1, marginLeft: 8 }]}
                      value={variant.price.toString()}
                      onChangeText={(text) => updateVariant(index, 'price', parseFloat(text) || 0)}
                      placeholder="Preço"
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      onPress={() => removeVariant(index)}
                      style={styles.removeVariantButton}
                    >
                      <X size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.formLabel}>Ativo</Text>
              <Switch
                value={formData.active ?? true}
                onValueChange={(value) => setFormData({ ...formData, active: value })}
                trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                thumbColor={formData.active ? '#ffffff' : '#f3f4f6'}
              />
            </View>
            
            <View style={styles.switchGroup}>
              <Text style={styles.formLabel}>Disponível</Text>
              <Switch
                value={formData.available ?? true}
                onValueChange={(value) => setFormData({ ...formData, available: value })}
                trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                thumbColor={formData.available ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancelar"
              onPress={() => setShowModal(false)}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title="Salvar"
              onPress={handleSave}
              variant="primary"
              style={styles.saveButton}
            />
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
  pageHeader: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#64748b',
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
  serviceItem: {
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
  itemStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  servicesList: {
    gap: 16,
  },
  variantsInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  variantsLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  variantText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  variantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addVariantButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  variantForm: {
    marginBottom: 8,
  },
  variantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeVariantButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fef2f2',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
});