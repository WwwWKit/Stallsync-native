import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import api from "../../constants/APIs";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function CheckoutCancel() {
  const { session_id } = useLocalSearchParams();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];

  useEffect(() => {
    if (!session_id) {
      console.log("❌ Missing session ID");
      return;
    }

    api.get("/pstrxpar/cancel?session_id=" + session_id)
      .then(() => console.log("❌ Payment cancelled. Stripe session ID:", session_id))
      .catch(err => console.error("Cancel request error:", err));
  }, [session_id]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "600", color: "red" }}>
        Payment Cancelled
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
          Back to Homepage
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
