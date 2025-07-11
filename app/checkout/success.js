// app/checkout/success.js
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import api from "../../constants/APIs";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function CheckoutSuccess() {
  const { session_id } = useLocalSearchParams();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];

  useEffect(() => {
    if (!session_id) {
      console.log("Missing session ID");
      return;
    }
    api.post("/pstrxpar/success?session_id=" + session_id);
    console.log("✅ Payment successful! Stripe session ID:", session_id);
  });

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 28, fontWeight: "600" }}>
        Payment Successful!
      </Text>
      <TouchableOpacity
        onPress={() => router.replace("/")}
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
