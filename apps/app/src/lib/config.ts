import { Platform } from 'react-native';

/**
 * On the web the app is served from the same domain as the API, under /api.
 * Native builds get the URL from EXPO_PUBLIC_API_URL (set per profile in eas.json,
 * or in apps/app/.env for local development).
 */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'web' ? '/api' : 'http://localhost:3000/api');
