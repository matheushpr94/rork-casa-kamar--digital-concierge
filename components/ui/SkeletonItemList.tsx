import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

interface SkeletonItemListProps {
  count?: number;
}

export function SkeletonItemList({ count = 3 }: SkeletonItemListProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={`skeleton-${index}`} style={styles.skeletonCard}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonContent}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonSubtitle} />
            <View style={styles.skeletonDescription} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  skeletonCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  skeletonContent: {
    gap: 8,
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    width: '70%',
  },
  skeletonSubtitle: {
    height: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    width: '40%',
  },
  skeletonDescription: {
    height: 14,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    width: '90%',
  },
});