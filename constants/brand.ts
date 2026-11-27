export const BrandColors = {
  cream: '#FBF7F4',
  panel: '#FFFDFB',
  blush: '#F1DCD8',
  blushSoft: '#F7EAE7',
  rose: '#C98D86',
  roseDeep: '#A15E56',
  nude: '#E7CDB8',
  ink: '#2B2420',
  inkSoft: '#6F635C',
  line: '#EADDD5',
  gold: '#B48A5A',
  success: '#5F8A5B',
  danger: '#B5483F',
  white: '#FFFFFF',
} as const;

export const Radius = { sm: 9, md: 14, lg: 22, pill: 999 } as const;
export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;

export const Fonts = {
  title: 'Fraunces_600SemiBold',
  titleBold: 'Fraunces_700Bold',
  body: 'WorkSans_400Regular',
  bodyMedium: 'WorkSans_500Medium',
  bodySemi: 'WorkSans_600SemiBold',
} as const;

export const Shadow = {
  card: {
    shadowColor: '#2B2420',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;
