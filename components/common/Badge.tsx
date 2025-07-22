import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Text } from '../Themed';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  animated?: boolean;
  pulse?: boolean;
}

export function Badge({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  animated = false,
  pulse = false,
}: BadgeProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animated]);

  useEffect(() => {
    if (pulse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [pulse]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.isDark ? theme.colors.primary[900] : theme.colors.primary[100],
          borderColor: theme.isDark ? theme.colors.primary[700] : theme.colors.primary[200],
          textColor: theme.isDark ? theme.colors.primary[300] : theme.colors.primary[700],
          iconColor: theme.isDark ? theme.colors.primary[400] : theme.colors.primary[600],
        };
      case 'secondary':
        return {
          backgroundColor: theme.isDark ? theme.colors.neutral[300] : theme.colors.neutral[100],
          borderColor: theme.isDark ? theme.colors.neutral[400] : theme.colors.neutral[200],
          textColor: theme.isDark ? theme.colors.neutral[100] : theme.colors.neutral[700],
          iconColor: theme.isDark ? theme.colors.neutral[200] : theme.colors.neutral[600],
        };
      case 'success':
        return {
          backgroundColor: theme.isDark ? theme.colors.success[900] : theme.colors.success[100],
          borderColor: theme.isDark ? theme.colors.success[700] : theme.colors.success[200],
          textColor: theme.isDark ? theme.colors.success[300] : theme.colors.success[700],
          iconColor: theme.isDark ? theme.colors.success[400] : theme.colors.success[600],
        };
      case 'warning':
        return {
          backgroundColor: theme.isDark ? theme.colors.warning[900] : theme.colors.warning[100],
          borderColor: theme.isDark ? theme.colors.warning[700] : theme.colors.warning[200],
          textColor: theme.isDark ? theme.colors.warning[300] : theme.colors.warning[700],
          iconColor: theme.isDark ? theme.colors.warning[400] : theme.colors.warning[600],
        };
      case 'error':
        return {
          backgroundColor: theme.isDark ? theme.colors.error[900] : theme.colors.error[100],
          borderColor: theme.isDark ? theme.colors.error[700] : theme.colors.error[200],
          textColor: theme.isDark ? theme.colors.error[300] : theme.colors.error[700],
          iconColor: theme.isDark ? theme.colors.error[400] : theme.colors.error[600],
        };
      case 'info':
        return {
          backgroundColor: theme.isDark ? theme.colors.accent[900] : theme.colors.accent[100],
          borderColor: theme.isDark ? theme.colors.accent[700] : theme.colors.accent[200],
          textColor: theme.isDark ? theme.colors.accent[300] : theme.colors.accent[700],
          iconColor: theme.isDark ? theme.colors.accent[400] : theme.colors.accent[600],
        };
      default:
        return {
          backgroundColor: theme.isDark ? theme.colors.primary[900] : theme.colors.primary[100],
          borderColor: theme.isDark ? theme.colors.primary[700] : theme.colors.primary[200],
          textColor: theme.isDark ? theme.colors.primary[300] : theme.colors.primary[700],
          iconColor: theme.isDark ? theme.colors.primary[400] : theme.colors.primary[600],
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          fontSize: 12,
          iconSize: 12,
          borderRadius: 6,
          borderWidth: 1,
        };
      case 'md':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 14,
          iconSize: 14,
          borderRadius: 8,
          borderWidth: 1,
        };
      case 'lg':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 16,
          iconSize: 16,
          borderRadius: 12,
          borderWidth: 1.5,
        };
      default:
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 14,
          iconSize: 14,
          borderRadius: 8,
          borderWidth: 1,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const badgeStyle: ViewStyle = {
    backgroundColor: variantStyles.backgroundColor,
    borderColor: variantStyles.borderColor,
    borderWidth: sizeStyles.borderWidth,
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: sizeStyles.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  };

  const textStyleObj: TextStyle = {
    color: variantStyles.textColor,
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: icon && iconPosition === 'left' ? 4 : 0,
    marginRight: icon && iconPosition === 'right' ? 4 : 0,
  };

  return (
    <Animated.View
      style={[
        badgeStyle,
        {
          transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      {icon && iconPosition === 'left' && (
        <Ionicons
          name={icon}
          size={sizeStyles.iconSize}
          color={variantStyles.iconColor}
          style={styles.leftIcon}
        />
      )}
      <Text style={[textStyleObj, textStyle]}>{label}</Text>
      {icon && iconPosition === 'right' && (
        <Ionicons
          name={icon}
          size={sizeStyles.iconSize}
          color={variantStyles.iconColor}
          style={styles.rightIcon}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
  },
});
