// app/checkout/success.js
import { useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function CheckoutOffline() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];

  

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: theme.background }}
    >
      <Text style={{ fontSize: 28, fontWeight: "600" }}>
        Proceed your order payment at the stall counter...
      </Text>
      <TouchableOpacity
        onPress={() => router.replace("/order")}
        style={{
          borderWidth: 2,
          paddingVertical: 20,
          paddingHorizontal: 30,
          marginTop: 20,
          borderRadius: 50,
          borderColor: theme.primary,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: theme.primary }}>
          Back to Order Page
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
