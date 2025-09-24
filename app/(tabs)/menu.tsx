import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { ChefHat, Search } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonItemList } from '@/components/ui/SkeletonItemList';
import { menuService } from '@/lib/services';
import { useQuery } from '@tanstack/react-query';

const categories = ['Todos', 'Entradas', 'Pratos Principais', 'Sobremesas', 'Bebidas'];

export default function MenuScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: menuCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['menuCategories'],
    queryFn: menuService.listCategories,
  });
  
  const { data: menuItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['menuItems', selectedCategory],
    queryFn: () => menuService.listItems(selectedCategory === 'Todos' ? undefined : selectedCategory),
  });
  
  const isLoading = categoriesLoading || itemsLoading;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cardápio</Text>
        <Text style={styles.subtitle}>Em breve - integração Firebase</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar no cardápio..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.categoryChip}
          />
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuList}>
          {isLoading ? (
            <SkeletonItemList count={5} />
          ) : (
            <EmptyState
              title="Cardápio em desenvolvimento"
              subtitle="O cardápio estará disponível em breve com integração Firebase. Esta tela usará dados diferentes dos serviços."
              icon={<ChefHat size={48} color="#6b7280" />}
            />
          )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  menuList: {
    padding: 16,
  },
});