// app/checkout/success.js
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function CheckoutSuccess() {
  const { session_id } = useLocalSearchParams();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];

  //   useEffect(() => {
  //     if (!session_id) {
  //       Alert.alert("Missing session ID");
  //       router.replace("/"); // Redirect to home or cart
  //       return;
  //     }

  //     console.log("✅ Payment successful! Stripe session ID:", session_id);

  //     setTimeout(() => {
  //       Alert.alert("Payment Successful!");
  //       router.replace("/"); // Or navigate to order summary page
  //     }, 1500);
  //   }, [session_id]);

  return (
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //   <ActivityIndicator size="large" />
    //   <Text style={{ marginTop: 10 }}>Processing your payment...</Text>
    // </View>
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 28, fontWeight: "600" }}>Payment Successful!</Text>
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
        <Text style={{ fontSize: 16, fontWeight: "600", color: theme.primary}}>Back to Homepage</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
