import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search,
  ExternalLink,
  Copy,
  X,
} from 'lucide-react-native';
import { HOUSE_MANUAL, searchManual, type ManualItem } from '@/lib/manual';

const categoryColors: Record<string, string> = {
  'internet': '#3b82f6',
  'wifi': '#3b82f6',
  'regras': '#ef4444',
  'contato': '#dc2626',
  'cozinha': '#f59e0b',
  'churrasqueira': '#10b981',
  'piscina': '#14b8a6',
  'ar-condicionado': '#06b6d4',
  'lavanderia': '#8b5cf6',
  'limpeza': '#f97316',
  'sustentabilidade': '#10b981',
  'segurança': '#dc2626',
  'transporte': '#6366f1',
};

function getColorForTags(tags: string[]): string {
  for (const tag of tags) {
    if (categoryColors[tag]) {
      return categoryColors[tag];
    }
  }
  return '#64748b';
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch (error) {
    console.error('Clipboard failed:', error);
    return false;
  }
}

export default function ManualScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<ManualItem[]>(HOUSE_MANUAL);
  
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const results = searchManual(query);
    setFilteredItems(results);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilteredItems(HOUSE_MANUAL);
  }, []);

  const handleItemPress = (item: ManualItem) => {
    // For now, just show the content inline
    // TODO: Create manual detail screen if needed
  };

  const handleLinkPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao abrir URL:', error);
    }
  };

  const handleCopyText = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      Alert.alert('Copiado!', 'Texto copiado para a área de transferência.');
    } else {
      Alert.alert('Erro', 'Não foi possível copiar o texto. Tente selecionar e copiar manualmente.');
    }
  };

  const renderCopyButton = (text: string) => {
    if (text.includes('SSID:') || text.includes('Senha:')) {
      return (
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => handleCopyText(text)}
        >
          <Copy size={16} color="#2563eb" />
          <Text style={styles.copyButtonText}>Copiar</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderManualItem = (item: ManualItem) => {
    const itemColor = getColorForTags(item.tags);

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.manualCard}
        onPress={() => handleItemPress(item)}
        testID={`manual-item-${item.id}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={[styles.tagBadge, { backgroundColor: `${itemColor}20` }]}>
                  <Text style={[styles.tagText, { color: itemColor }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
          <ExternalLink size={20} color="#64748b" />
        </View>

        <View style={styles.cardBody}>
          {item.body.slice(0, 2).map((paragraph, index) => (
            <View key={index} style={styles.paragraphContainer}>
              <Text style={styles.cardDescription}>{paragraph}</Text>
              {renderCopyButton(paragraph)}
            </View>
          ))}
          
          {item.links && item.links.length > 0 && (
            <View style={styles.linksContainer}>
              {item.links.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.linkButton}
                  onPress={() => handleLinkPress(link.url)}
                >
                  <ExternalLink size={14} color="#2563eb" />
                  <Text style={styles.linkText}>{link.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.title}>House Manual</Text>
        <Text style={styles.subtitle}>Tudo que você precisa saber</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar no manual..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9ca3af"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <X size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.manualList}>
          {filteredItems.length > 0 ? (
            filteredItems.map(renderManualItem)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum item encontrado</Text>
              <Text style={styles.emptyStateSubtext}>Tente buscar por outros termos</Text>
            </View>
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
    marginBottom: 16,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  content: {
    flex: 1,
  },
  manualList: {
    padding: 16,
    gap: 16,
  },
  manualCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  cardTitleContainer: {
    flex: 1,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  cardBody: {
    gap: 12,
  },
  paragraphContainer: {
    gap: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    gap: 6,
  },
  copyButtonText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  linksContainer: {
    gap: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    gap: 6,
  },
  linkText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});