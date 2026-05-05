import { useSettingsStore } from '@/stores/settingsStore';

export function useColorScheme() {
  return useSettingsStore((state) => state.theme);
}
