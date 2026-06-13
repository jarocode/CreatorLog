import * as SecureStore from 'expo-secure-store';

/**
 * Supabase auth `storage` adapter backed by expo-secure-store (encrypted
 * keychain / keystore) so the session — which holds the access + refresh
 * tokens — is persisted securely across launches.
 *
 * SecureStore advises values <= 2KB and a serialized Supabase session can
 * exceed that, so values are transparently chunked across keys. A chunked
 * value stores a marker (`__CHUNKED__:<n>`) at the base key and the parts at
 * `<key>.0 … <key>.n-1`. SecureStore keys may only contain [A-Za-z0-9._-];
 * Supabase's `sb-<ref>-auth-token` key plus a numeric suffix satisfies that.
 */
const CHUNK_SIZE = 2000;
const MARKER = '__CHUNKED__:';

async function clearChunks(key: string): Promise<void> {
  const head = await SecureStore.getItemAsync(key);
  if (head?.startsWith(MARKER)) {
    const count = parseInt(head.slice(MARKER.length), 10);
    for (let i = 0; i < count; i++) {
      await SecureStore.deleteItemAsync(`${key}.${i}`);
    }
  }
}

export const secureStorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    const head = await SecureStore.getItemAsync(key);
    if (head === null) return null;
    if (!head.startsWith(MARKER)) return head;

    const count = parseInt(head.slice(MARKER.length), 10);
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      parts.push((await SecureStore.getItemAsync(`${key}.${i}`)) ?? '');
    }
    return parts.join('');
  },

  async setItem(key: string, value: string): Promise<void> {
    // Remove any chunks from a previous (larger) value before rewriting.
    await clearChunks(key);

    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }

    const count = Math.ceil(value.length / CHUNK_SIZE);
    for (let i = 0; i < count; i++) {
      await SecureStore.setItemAsync(
        `${key}.${i}`,
        value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
      );
    }
    await SecureStore.setItemAsync(key, `${MARKER}${count}`);
  },

  async removeItem(key: string): Promise<void> {
    await clearChunks(key);
    await SecureStore.deleteItemAsync(key);
  },
};
