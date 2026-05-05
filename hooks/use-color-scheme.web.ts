import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    return theme;
  }

  return 'dark' as const;
}
