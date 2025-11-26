// Cores idênticas ao tema web
export const colors = {
  // Background gradients
  background: {
    primary: '#0f172a', // slate-900
    secondary: '#581c87', // purple-900
    gradient: ['#0f172a', '#581c87', '#0f172a'],
  },
  
  // Primary colors
  purple: {
    400: '#a78bfa',
    500: '#8b5cf6',
    900: '#581c87',
  },
  
  blue: {
    400: '#60a5fa',
    500: '#3b82f6',
  },
  
  // Status colors
  green: {
    400: '#4ade80',
    500: '#22c55e',
  },
  
  yellow: {
    400: '#facc15',
    500: '#eab308',
  },
  
  red: {
    400: '#f87171',
    500: '#ef4444',
  },
  
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
    muted: 'rgba(255, 255, 255, 0.4)',
  },
  
  // Card colors
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    hover: 'rgba(255, 255, 255, 0.1)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

