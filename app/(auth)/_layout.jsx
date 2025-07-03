import { Stack } from "expo-router"; // ✅ correct import
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/colors";

const AuthLayout = () => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

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
    </Stack>
  );
}
export default  AuthLayout;