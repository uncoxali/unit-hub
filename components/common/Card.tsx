import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Animated, Easing, TouchableOpacity } from 'react-native';
import { useTheme } from '../Themed';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  onPress?: () => void;
  animated?: boolean;
  hover?: boolean;
  disabled?: boolean;
}

export function Card({
  children,
  variant = 'default',
  size = 'md',
  style,
  onPress,
  animated = false,
  hover = false,
  disabled = false,
}: CardProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    if (!disabled && (onPress || hover)) {
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && (onPress || hover)) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }).start();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: theme.colors.surface.primary,
          borderColor: 'transparent',
          borderWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.isDark ? 0.3 : 0.05,
          shadowRadius: 8,
          elevation: 2,
        };
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface.primary,
          borderColor: 'transparent',
          borderWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: theme.isDark ? 0.4 : 0.1,
          shadowRadius: 12,
          elevation: 4,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface.primary,
          borderColor: theme.isDark ? theme.colors.neutral[400] : theme.colors.neutral[200],
          borderWidth: 1,
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        };
      case 'glass':
        return {
          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
          borderWidth: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: theme.isDark ? 0.3 : 0.15,
          shadowRadius: 16,
          elevation: 8,
        };
      default:
        return {
          backgroundColor: theme.colors.surface.primary,
          borderColor: 'transparent',
          borderWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.isDark ? 0.3 : 0.05,
          shadowRadius: 8,
          elevation: 2,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 12,
          borderRadius: 12,
        };
      case 'md':
        return {
          padding: 16,
          borderRadius: 16,
        };
      case 'lg':
        return {
          padding: 20,
          borderRadius: 20,
        };
      default:
        return {
          padding: 16,
          borderRadius: 16,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const cardStyle: ViewStyle = {
    backgroundColor: variantStyles.backgroundColor,
    borderColor: variantStyles.borderColor,
    borderWidth: variantStyles.borderWidth,
    padding: sizeStyles.padding,
    borderRadius: sizeStyles.borderRadius,
    opacity: disabled ? 0.6 : 1,
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
    shadowColor: variantStyles.shadowColor,
    shadowOffset: variantStyles.shadowOffset,
    shadowOpacity: animated
      ? shadowAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, variantStyles.shadowOpacity],
        })
      : variantStyles.shadowOpacity,
    shadowRadius: variantStyles.shadowRadius,
    elevation: variantStyles.elevation,
  };

  const CardComponent = (
    <Animated.View style={[cardStyle, animatedStyle, style]}>{children}</Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        {CardComponent}
      </TouchableOpacity>
    );
  }

  return CardComponent;
}
