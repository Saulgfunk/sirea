// Ported from docs/design-system/tokens.json — keep in sync by hand for now
// (no build-time generation yet; this file IS the source of truth for the app).

export const color = {
  void: '#0a0910',
  surface: '#15121f',
  surface2: '#1d1830',
  border: '#2b2540',
  ink: '#f3efe8',
  inkSoft: '#d8d3e6',
  inkMuted: '#a79fbe',
  gold: '#c9a961',
  purple: '#8b7fd1',
  coral: '#e0785a',
} as const;

export const font = {
  display: undefined, // 'Fraunces' — load via expo-font once the typeface asset is added
  body: undefined, // 'Manrope'
} as const;

export const type = {
  displayXl: { fontSize: 48, lineHeight: 52, fontWeight: '600' as const },
  displayL: { fontSize: 32, lineHeight: 35, fontWeight: '600' as const },
  displayM: { fontSize: 23, lineHeight: 29, fontWeight: '600' as const },
  displayS: { fontSize: 19, lineHeight: 25, fontWeight: '600' as const },
  displayXs: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
  bodyL: { fontSize: 16, lineHeight: 26, fontWeight: '400' as const },
  bodyM: { fontSize: 14, lineHeight: 22, fontWeight: '400' as const },
  bodyS: { fontSize: 13, lineHeight: 21, fontWeight: '400' as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700' as const },
  caption: { fontSize: 11, lineHeight: 15, fontWeight: '700' as const },
};

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
  pill: 999,
} as const;
