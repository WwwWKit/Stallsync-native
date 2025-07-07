import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider } from '../constants/AuthContext';
import { useColorScheme } from "../hooks/useColorScheme";
import FloatingCartButton from './../components/FloatingCartButton';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  

  return (
    <AuthProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{flex: 1}}>
        <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <FloatingCartButton />
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
    </AuthProvider>
  );
}

