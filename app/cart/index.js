import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { cartAPI } from "../../services/backendAPIs";

const CartOverview = () => {
  const router = useRouter();
  const [merchantList, setMerchantList] = useState([]);
  const [cartId, setCartId] = useState(""); // ✅ store your cartId for navigation

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const results = await cartAPI.listMerchant();
      if (results.length > 0) {
        // ✅ get cartId from backend if attached to merchant OR from token if known
        // You can hardcode it temporarily or extend backend to include it
        setCartId("YOUR_CART_ID_FROM_TOKEN_OR_API"); // replace later
      }
      setMerchantList(results);
    } catch (err) {
      console.error("Failed to fetch merchant list:", err);
    }
  };

  const handleMerchantPress = (cartid, merchantid) => {
    router.push(`/cart/${cartid}/${merchantid}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your Cart by Merchant</Text>
        {merchantList.map((merchant) => (
          <TouchableOpacity
            key={merchant.psmrcuid}
            style={styles.card}
            onPress={() =>
              handleMerchantPress(cartId, merchant.psmrcuid) // ✅ pass both values
            }
          >
            <Text style={styles.merchantName}>{merchant.psmrcnme}</Text>
            <Text style={styles.cartId}>Merchant ID: {merchant.psmrcuid}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#f3f3f3",
    elevation: 2,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: "600",
  },
  cartId: {
    fontSize: 14,
    color: "gray",
  },
});


export default  CartOverview;