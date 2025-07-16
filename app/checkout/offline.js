// app/checkout/success.js
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { orderAPI, transactionAPI } from "./../../services/backendAPIs";

export default function CheckoutOffline() {
  const router = useRouter();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Payment at Counter",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
    });
  }, [navigation]);

  const createOrder = async () => {
    const orderPayload = {
      psordrap: "N",
      psordpap: "N",
      psmrcuid: merchantid,
    };

    try {
      const orderRes = await orderAPI.createOrder(orderPayload, {
        timeout: 15000,
      });

      if (!orderRes || !orderRes.message?.ordId) {
        throw new Error("Order response is invalid.");
      }

      return orderRes.message.ordId;
    } catch (error) {
      console.error("Error in create order:", error);
      showAlert(
        "Order Creation Failed",
        "Unable to place order. Please try again later."
      );
      return null;
    }
  };
  const handleCashPayment = async () => {
    const createdOrdId = await createOrder();
    if (!createdOrdId) return;

    const trxRes = await transactionAPI.createOffline(createdOrdId, total);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: theme.background,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "600",
          textAlign: "center",
          color: theme.text,
        }}
      >
        Pay at the Stall?
      </Text>
      <TouchableOpacity
        onPress={handleCashPayment}
        style={{
          borderWidth: 2,
          width: "90%",
          paddingVertical: 20,
          paddingHorizontal: 30,
          marginTop: 20,
          borderRadius: 50,
          borderColor: theme.white,
          alignItems: "center",
          backgroundColor: theme.primary,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text }}>
          Confirm
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back("")}
        style={{
          borderWidth: 2,
          width: "90%",
          paddingVertical: 20,
          paddingHorizontal: 30,
          marginTop: 20,
          borderRadius: 50,
          borderColor: theme.primary,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: theme.primary }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
