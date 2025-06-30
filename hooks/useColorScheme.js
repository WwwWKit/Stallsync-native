import { useColorScheme as _useColorScheme } from 'react-native';

/**
 * Returns 'light' or 'dark' depending on the device color scheme.
 * Falls back to 'light' by default if undefined.
 */
export function useColorScheme() {
  const scheme = _useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}