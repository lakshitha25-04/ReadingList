import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  user: 'session_user', mode: 'auth_mode', preferences: 'reading_preferences', theme: 'app_theme',
  searches: 'recent_searches', favouriteGenres: 'favourite_genres', queue: 'reading_queue',
  streak: 'reading_streak', badges: 'earned_badges', token: 'auth_token',
} as const;

export async function readStorage<T>(key: string, fallback: T): Promise<T> {
  try { const raw = await AsyncStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
export async function writeStorage<T>(key: string, value: T, message = 'Saved'): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value)); console.log(`[Storage] ${message}: ${key}`);
}
export async function clearSessionStorage(): Promise<void> {
  await AsyncStorage.multiRemove([storageKeys.token, storageKeys.mode, storageKeys.user]); console.log('[Storage] Session cleared');
}
