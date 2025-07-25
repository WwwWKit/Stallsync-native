import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useAuth } from "../../constants/AuthContext"; // assumes your context is here
import { Colors } from "../../constants/colors";

const AuthLayout = () => {
  const { isLoggedIn, isAuthChecking } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  useEffect(() => {
    if (!isAuthChecking && isLoggedIn) {
      router.replace("/"); 
    }
  }, [isLoggedIn, isAuthChecking]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgetpw" />
    </Stack>
  );
};

export default AuthLayout;
