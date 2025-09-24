import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type BadgeVariant = 'neutral' | 'indigo' | 'emerald' | 'rose' | 'amber';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const variantStyles = {
  neutral: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    textColor: '#374151',
  },
  indigo: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
    textColor: '#6366f1',
  },
  emerald: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#10b981',
  },
  rose: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    textColor: '#f43f5e',
  },
  amber: {
    backgroundColor: '#fffbeb',
    borderColor: '#fed7aa',
    textColor: '#f59e0b',
  },
};

export function Badge({
  label,
  variant = 'neutral',
  icon,
  style,
}: BadgeProps) {
  const variantStyle = variantStyles[variant];

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: variantStyle.backgroundColor,
        borderColor: variantStyle.borderColor,
      },
      style,
    ]}>
      {icon && icon}
      <Text style={[
        styles.text,
        { color: variantStyle.textColor },
      ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});