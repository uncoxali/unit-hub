/**
 * Ultra Modern Dark Mode Design System for Unit-Hub
 * Beautiful, professional, and stunning dark theme
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  View as RNView,
  Text as RNText,
  TextInput as RNTextInput,
  ScrollView as RNScrollView,
  StyleSheet,
  useColorScheme as _useColorScheme,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Ultra Modern Color Palette - Dark Mode First Design
const Colors = {
  light: {
    // Primary - Modern Blue
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    // Accent - Purple
    accent: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    // Success - Emerald
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    // Warning - Amber
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    // Error - Rose
    error: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
    },
    // Neutral - Slate
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    // Background
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    // Surface
    surface: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    // Text
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      inverse: '#ffffff',
    },
  },
  dark: {
    // Primary - Electric Blue (Ultra Bright)
    primary: {
      50: '#0c4a6e',
      100: '#075985',
      200: '#0369a1',
      300: '#0284c7',
      400: '#0ea5e9',
      500: '#38bdf8', // Main blue - ultra bright
      600: '#7dd3fc',
      700: '#bae6fd',
      800: '#e0f2fe',
      900: '#f0f9ff',
    },
    // Accent - Neon Purple (Ultra Bright)
    accent: {
      50: '#2e1065',
      100: '#4c1d95',
      200: '#5b21b6',
      300: '#6d28d9',
      400: '#7c3aed',
      500: '#8b5cf6', // Main purple - neon bright
      600: '#a855f7',
      700: '#c084fc',
      800: '#d8b4fe',
      900: '#e9d5ff',
    },
    // Success - Neon Green (Ultra Bright)
    success: {
      50: '#064e3b',
      100: '#065f46',
      200: '#047857',
      300: '#059669',
      400: '#10b981',
      500: '#34d399', // Main green - neon bright
      600: '#6ee7b7',
      700: '#a7f3d0',
      800: '#d1fae5',
      900: '#ecfdf5',
    },
    // Warning - Neon Orange (Ultra Bright)
    warning: {
      50: '#451a03',
      100: '#78350f',
      200: '#92400e',
      300: '#b45309',
      400: '#d97706',
      500: '#f59e0b', // Main orange - neon bright
      600: '#fbbf24',
      700: '#fcd34d',
      800: '#fde68a',
      900: '#fef3c7',
    },
    // Error - Neon Red (Ultra Bright)
    error: {
      50: '#4c0519',
      100: '#7f1d1d',
      200: '#991b1b',
      300: '#b91c1c',
      400: '#dc2626',
      500: '#ef4444', // Main red - neon bright
      600: '#f87171',
      700: '#fca5a5',
      800: '#fecaca',
      900: '#fee2e2',
    },
    // Neutral - Deep Space Gray (Ultra Dark)
    neutral: {
      50: '#000000', // Pure black
      100: '#0a0a0a', // Almost black
      200: '#1a1a1a', // Very dark gray
      300: '#2a2a2a', // Dark gray
      400: '#3a3a3a', // Medium dark gray
      500: '#4a4a4a', // Medium gray
      600: '#5a5a5a', // Medium light gray
      700: '#6a6a6a', // Light gray
      800: '#7a7a7a', // Very light gray
      900: '#8a8a8a', // Almost white
    },
    // Background - Deep Space
    background: {
      primary: '#000000', // Pure black background
      secondary: '#0a0a0a', // Almost black
      tertiary: '#1a1a1a', // Very dark gray
    },
    // Surface - Deep Space with Glow
    surface: {
      primary: '#0a0a0a', // Almost black surface
      secondary: '#1a1a1a', // Very dark gray
      tertiary: '#2a2a2a', // Dark gray
    },
    // Text - Ultra Bright for Perfect Contrast
    text: {
      primary: '#ffffff', // Pure white text
      secondary: '#e0e0e0', // Very light gray
      tertiary: '#c0c0c0', // Light gray
      inverse: '#000000', // Black for inverse
    },
  },
};

// Theme Context
interface ThemeContextType {
  isDark: boolean;
  colors: typeof Colors.light | typeof Colors.dark;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: Colors.light,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = _useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const toggleTheme = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsDark(!isDark);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>{children}</Animated.View>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// Ultra Modern Themed Components
export function Text(props: {
  children: React.ReactNode;
  style?: any;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'inverse';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
}) {
  const { colors, isDark } = useTheme();

  const getTextStyle = () => {
    const baseStyle = {
      color: colors.text.primary,
      fontFamily: 'System',
    };

    const variantStyle = {
      primary: { color: colors.text.primary },
      secondary: { color: colors.text.secondary },
      tertiary: { color: colors.text.tertiary },
      inverse: { color: colors.text.inverse },
    };

    const sizeStyle = {
      xs: { fontSize: 12, lineHeight: 16 },
      sm: { fontSize: 14, lineHeight: 20 },
      base: { fontSize: 16, lineHeight: 24 },
      lg: { fontSize: 18, lineHeight: 28 },
      xl: { fontSize: 20, lineHeight: 28 },
      '2xl': { fontSize: 24, lineHeight: 32 },
      '3xl': { fontSize: 30, lineHeight: 36 },
      '4xl': { fontSize: 36, lineHeight: 40 },
    };

    const weightStyle = {
      normal: { fontWeight: '400' as const },
      medium: { fontWeight: '500' as const },
      semibold: { fontWeight: '600' as const },
      bold: { fontWeight: '700' as const },
      extrabold: { fontWeight: '800' as const },
    };

    return {
      ...baseStyle,
      ...variantStyle[props.variant || 'primary'],
      ...sizeStyle[props.size || 'base'],
      ...weightStyle[props.weight || 'normal'],
    };
  };

  return <RNText style={[getTextStyle(), props.style]}>{props.children}</RNText>;
}

export function View(props: { children: React.ReactNode; style?: any }) {
  const { colors } = useTheme();
  return (
    <RNView style={[{ backgroundColor: colors.background.primary }, props.style]}>
      {props.children}
    </RNView>
  );
}

export function ScrollView(props: {
  children: React.ReactNode;
  style?: any;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <RNScrollView
      style={[{ backgroundColor: colors.background.primary }, props.style]}
      contentContainerStyle={props.contentContainerStyle}
      showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
    >
      {props.children}
    </RNScrollView>
  );
}

export function TextInput(props: {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any;
  secureTextEntry?: boolean;
}) {
  const { colors, isDark } = useTheme();

  const inputStyle = {
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: isDark ? colors.neutral[300] : colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    placeholderTextColor: colors.text.tertiary,
  };

  return (
    <RNTextInput
      style={[inputStyle, props.style]}
      placeholder={props.placeholder}
      value={props.value}
      onChangeText={props.onChangeText}
      secureTextEntry={props.secureTextEntry}
      placeholderTextColor={colors.text.tertiary}
    />
  );
}

export function Card(props: {
  children: React.ReactNode;
  style?: any;
  variant?: 'primary' | 'secondary' | 'elevated' | 'glass' | 'gradient' | 'neon';
  padding?: number;
  margin?: number;
  borderRadius?: number;
}) {
  const { colors, isDark } = useTheme();

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: colors.surface.primary,
      borderRadius: props.borderRadius || 20,
      padding: props.padding || 24,
      margin: props.margin || 0,
    };

    switch (props.variant) {
      case 'neon':
        return {
          ...baseStyle,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          borderWidth: 2,
          borderColor: colors.primary[500],
          shadowColor: colors.primary[500],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 8,
        };
      case 'elevated':
        return {
          ...baseStyle,
          shadowColor: isDark ? colors.primary[500] : colors.text.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.2 : 0.15,
          shadowRadius: 24,
          elevation: 8,
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          shadowColor: colors.text.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 4,
        };
      case 'gradient':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          shadowColor: colors.text.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 6,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.surface.secondary,
          shadowColor: colors.text.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 2,
        };
      default:
        return {
          ...baseStyle,
          shadowColor: colors.text.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 4,
        };
    }
  };

  if (props.variant === 'gradient') {
    return (
      <RNView style={[getCardStyle(), props.style]}>
        <LinearGradient
          colors={[colors.primary[500], colors.accent[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: props.borderRadius || 20,
            padding: props.padding || 24,
          }}
        >
          {props.children}
        </LinearGradient>
      </RNView>
    );
  }

  return <RNView style={[getCardStyle(), props.style]}>{props.children}</RNView>;
}

export function Gradient(props: {
  children: React.ReactNode;
  colors: readonly [string, string, ...string[]];
  style?: any;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}) {
  return (
    <LinearGradient
      colors={props.colors}
      start={props.start || { x: 0, y: 0 }}
      end={props.end || { x: 1, y: 1 }}
      style={props.style}
    >
      {props.children}
    </LinearGradient>
  );
}
