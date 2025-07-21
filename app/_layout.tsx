import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import FloatingCartButton from "../components/FloatingCartButton";
import { AuthProvider, useAuth } from "../constants/AuthContext";
import { useColorScheme } from "../hooks/useColorScheme";

// AuthGate ensures user is logged in before rendering children
function AuthGate({ children }) {
  const { isLoggedIn, isLoadingAuth } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && !isLoggedIn && !hasRedirected) {
      setHasRedirected(true); // prevent infinite loop
      router.replace("/sign-in");
    }
  }, [isLoadingAuth, isLoggedIn, hasRedirected]);

  // Don't render children while checking auth or redirecting
  if (isLoadingAuth || !isLoggedIn) return null;

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1 }}>
          <AuthGate>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <FloatingCartButton />
          </AuthGate>
        </View>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
