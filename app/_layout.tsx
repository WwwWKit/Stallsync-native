import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import FloatingCartButton from "../components/FloatingCartButton";
import { AuthProvider, useAuth } from "../constants/AuthContext";
import { useColorScheme } from "../hooks/useColorScheme";

function AuthGate() {
  const { isLoadingAuth, isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!isLoggedIn && pathname !== "/sign-in") {
        // Redirect to login page
        router.replace("/sign-in");
      } else if (isLoggedIn && pathname === "/sign-in") {
        // If already logged in and somehow landed on login page, redirect to /tabs
        router.replace("/(tabs)");
      }
    }
  }, [isLoadingAuth, isLoggedIn, pathname]);

  if (isLoadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <FloatingCartButton />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthGate />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
