import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  cartAPI,
  merchantAPI,
  productAPI,
} from "../../../../services/backendAPIs";

const CartDetail = () => {
  const { cartid, merchantid } = useLocalSearchParams();
  const [cartItems, setCartItems] = useState([]);
  const [merchant, setMerchant] = useState("");
  const [cart, setCart] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartid && merchantid) {
      fetchCart();
      fetchMerchant();
      fetchCartItem();
    }
  }, [cartid, merchantid]);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart(merchantid);
      console.log(res);
      setCart(res);
    } catch (error) {
      console.log("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchant = async () => {
    try {
      const res = await merchantAPI.getMerchant(merchantid);
      console.log(res);
      setMerchant(res);
    } catch (error) {
      console.log("Failed to fetch merchant:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItem = async () => {
    try {
      const res = await productAPI.listCartItems(cartid, merchantid);
      console.log(res);
      const enriched = await Promise.all(
        res.map(async (item) => ({
          ...item,
          image: productAPI.fetchImage(item.psprdimg),
        }))
      );

      setCartItems(enriched);
    } catch (error) {
      console.log("Failed to fetch cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
      return (
        <SafeAreaView style={styles.center}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      );

  if (!cartItems.length)
    return (
      <SafeAreaView style={styles.center}>
        <Text>No items from this merchant in your cart.</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Items from this Merchant</Text>
        {cartItems.map((item) => (
          <View key={item.psprduid} style={styles.card}>
            <Image
              source={{ uri: item.img }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.name}>{item.psprdnme}</Text>
              <Text style={styles.price}>RM {item.psprdpri}</Text>
              <Text style={styles.quantity}>Qty: {item.crtqty}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    color: "#333",
  },
  quantity: {
    fontSize: 14,
    color: "#777",
  },
});

export default CartDetail;
