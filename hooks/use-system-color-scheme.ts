import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Reads the OS-level system appearance (Light/Dark) directly from React Native's
 * Appearance API.
 *
 * This is intentionally separate from `@/hooks/use-color-scheme`, which reads the
 * in-app Zustand `settingsStore` (defaults to 'dark' and isn't hydrated at launch).
 * The splash screen must reflect the device theme the OS already painted in the
 * native splash, so it uses this hook only.
 */
export function useSystemColorScheme(): 'light' | 'dark' {
  return useRNColorScheme() ?? 'light';
}
