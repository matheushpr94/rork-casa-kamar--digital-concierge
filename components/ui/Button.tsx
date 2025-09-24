import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'outline' | 'success' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const variantStyles = {
  primary: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#d1d5db',
  },
  success: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  danger: {
    backgroundColor: '#f43f5e',
    borderColor: '#f43f5e',
  },
};

const variantTextStyles = {
  primary: { color: 'white' },
  outline: { color: '#374151' },
  success: { color: 'white' },
  danger: { color: 'white' },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantTextStyles[variant].color} />
      ) : (
        <Text style={[styles.text, variantTextStyles[variant], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});