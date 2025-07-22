import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Text } from '../Themed';

const { width } = Dimensions.get('window');

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  rounded?: boolean;
  elevation?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onPress,
  style,
  textStyle,
  fullWidth = false,
  rounded = true,
  elevation = true,
}: ButtonProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      opacityAnim.setValue(1);
    }
  }, [loading]);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary[500],
          borderColor: theme.colors.primary[500],
          textColor: 'white',
        };
      case 'secondary':
        return {
          backgroundColor: theme.isDark
            ? theme.colors.neutral[200]
            : theme.colors.surface.secondary,
          borderColor: theme.isDark ? theme.colors.neutral[200] : theme.colors.surface.secondary,
          textColor: theme.isDark ? theme.colors.text.primary : theme.colors.text.primary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary[500],
          textColor: theme.colors.primary[500],
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: theme.colors.primary[500],
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error[500],
          borderColor: theme.colors.error[500],
          textColor: 'white',
        };
      default:
        return {
          backgroundColor: theme.colors.primary[500],
          borderColor: theme.colors.primary[500],
          textColor: 'white',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 16,
          borderRadius: rounded ? 8 : 4,
        };
      case 'md':
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          fontSize: 16,
          iconSize: 18,
          borderRadius: rounded ? 12 : 6,
        };
      case 'lg':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 18,
          iconSize: 20,
          borderRadius: rounded ? 16 : 8,
        };
      case 'xl':
        return {
          paddingVertical: 20,
          paddingHorizontal: 32,
          fontSize: 20,
          iconSize: 24,
          borderRadius: rounded ? 20 : 10,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          fontSize: 16,
          iconSize: 18,
          borderRadius: rounded ? 12 : 6,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonStyle: ViewStyle = {
    backgroundColor: variantStyles.backgroundColor,
    borderColor: variantStyles.borderColor,
    borderWidth: variant === 'outline' ? 1.5 : 0,
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: sizeStyles.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: size === 'xl' ? 64 : size === 'lg' ? 56 : size === 'md' ? 48 : 40,
    width: fullWidth ? '100%' : undefined,
    shadowColor: elevation ? '#000' : 'transparent',
    shadowOffset: elevation ? { width: 0, height: 2 } : { width: 0, height: 0 },
    shadowOpacity: elevation ? 0.1 : 0,
    shadowRadius: elevation ? 8 : 0,
    elevation: elevation ? 3 : 0,
    opacity: disabled ? 0.5 : 1,
  };

  const textStyleObj: TextStyle = {
    color: variantStyles.textColor,
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: icon && iconPosition === 'left' ? 8 : 0,
    marginRight: icon && iconPosition === 'right' ? 8 : 0,
  };

  return (
    <Animated.View
      style={[
        buttonStyle,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {loading ? (
          <Animated.View style={[styles.loadingContainer, { opacity: opacityAnim }]}>
            <Ionicons name='refresh' size={sizeStyles.iconSize} color={variantStyles.textColor} />
          </Animated.View>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={sizeStyles.iconSize}
                color={variantStyles.textColor}
                style={styles.leftIcon}
              />
            )}
            <Text style={[textStyleObj, textStyle]}>{title}</Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={sizeStyles.iconSize}
                color={variantStyles.textColor}
                style={styles.rightIcon}
              />
            )}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
