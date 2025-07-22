// Modern Theme System for Unit-Hub
export const UnitHubTheme = {
  light: {
    // Primary Colors
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
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
    // Secondary Colors
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
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
    // Unit-Hub Brand Colors
    unitHub: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    // Background Colors
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
      surface: '#ffffff',
    },
    // Text Colors
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      inverse: '#ffffff',
      muted: '#94a3b8',
    },
    // Border Colors
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      dark: '#94a3b8',
      focus: '#3b82f6',
    },
    // Status Colors
    status: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    // Interactive Colors
    interactive: {
      pressed: 'rgba(59, 130, 246, 0.1)',
      hover: 'rgba(59, 130, 246, 0.05)',
      focus: 'rgba(59, 130, 246, 0.2)',
    },
    // Tab Colors
    tab: {
      background: '#ffffff',
      active: '#3b82f6',
      inactive: '#64748b',
      border: '#e2e8f0',
    },
  },
  dark: {
    // Primary Colors
    primary: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
      50: '#172554',
      100: '#1e3a8a',
      200: '#1e40af',
      300: '#1d4ed8',
      400: '#2563eb',
      500: '#3b82f6',
      600: '#60a5fa',
      700: '#93c5fd',
      800: '#bfdbfe',
      900: '#dbeafe',
    },
    // Secondary Colors
    secondary: {
      main: '#34d399',
      light: '#6ee7b7',
      dark: '#10b981',
      50: '#022c22',
      100: '#064e3b',
      200: '#065f46',
      300: '#047857',
      400: '#059669',
      500: '#10b981',
      600: '#34d399',
      700: '#6ee7b7',
      800: '#a7f3d0',
      900: '#d1fae5',
    },
    // Unit-Hub Brand Colors
    unitHub: {
      main: '#38bdf8',
      light: '#7dd3fc',
      dark: '#0ea5e9',
      50: '#082f49',
      100: '#0c4a6e',
      200: '#075985',
      300: '#0369a1',
      400: '#0284c7',
      500: '#0ea5e9',
      600: '#38bdf8',
      700: '#7dd3fc',
      800: '#bae6fd',
      900: '#e0f2fe',
    },
    // Background Colors
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      card: '#1e293b',
      surface: '#334155',
    },
    // Text Colors
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      inverse: '#0f172a',
      muted: '#64748b',
    },
    // Border Colors
    border: {
      light: '#334155',
      medium: '#475569',
      dark: '#64748b',
      focus: '#60a5fa',
    },
    // Status Colors
    status: {
      success: '#4ade80',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
    },
    // Interactive Colors
    interactive: {
      pressed: 'rgba(96, 165, 250, 0.2)',
      hover: 'rgba(96, 165, 250, 0.1)',
      focus: 'rgba(96, 165, 250, 0.3)',
    },
    // Tab Colors
    tab: {
      background: '#1e293b',
      active: '#60a5fa',
      inactive: '#94a3b8',
      border: '#334155',
    },
  },
};

// Utility function to get theme colors dynamically
export const getThemeColor = (colorPath: string, isDark: boolean = false) => {
  const theme = isDark ? UnitHubTheme.dark : UnitHubTheme.light;
  const path = colorPath.split('.');
  let result: any = theme;

  for (const key of path) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }

  return result;
};

// Legacy compatibility
const tintColorLight = UnitHubTheme.light.primary.main;
const tintColorDark = UnitHubTheme.dark.primary.main;

export default {
  light: {
    text: UnitHubTheme.light.text.primary,
    background: UnitHubTheme.light.background.primary,
    tint: tintColorLight,
    tabIconDefault: UnitHubTheme.light.tab.inactive,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: UnitHubTheme.dark.text.primary,
    background: UnitHubTheme.dark.background.primary,
    tint: tintColorDark,
    tabIconDefault: UnitHubTheme.dark.tab.inactive,
    tabIconSelected: tintColorDark,
  },
};

// Design tokens for consistent spacing and styling
export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  strong: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
  glow: '0 0 20px rgba(59, 130, 246, 0.15)',
  'glow-success': '0 0 20px rgba(34, 197, 94, 0.15)',
  'glow-error': '0 0 20px rgba(239, 68, 68, 0.15)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

export const borderRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

export const animations = {
  fadeIn: 'fadeIn 0.5s ease-in-out',
  fadeOut: 'fadeOut 0.5s ease-in-out',
  slideUp: 'slideUp 0.3s ease-out',
  slideDown: 'slideDown 0.3s ease-out',
  scaleIn: 'scaleIn 0.2s ease-out',
  bounceIn: 'bounceIn 0.6s ease-out',
};
