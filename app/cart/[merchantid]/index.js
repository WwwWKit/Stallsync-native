import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { createCartStyles } from "../../../assets/styles/cart.styles";
import { Colors } from "../../../constants/colors";
import { getReturnUrl } from "../../../constants/ReturnURL";
import {
  cartAPI,
  orderAPI,
  productAPI,
  transactionAPI,
} from "../../../services/backendAPIs";

const CartDetail = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const cartStyles = createCartStyles(theme);
  const { merchantid } = useLocalSearchParams();
  const [cartItems, setCartItems] = useState([]);
  const [merchant, setMerchant] = useState("");
  const [cart, setCart] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [sst, setSst] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Cart Items",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 25 },
    });
  }, [navigation]);

  const calculate = async () => {
    const subtotal = parseFloat(
      cartItems.reduce((acc, item) => acc + parseFloat(item.psitmsbt), 0)
    ).toFixed(2);
    const sst = parseFloat(subtotal * 0.06).toFixed(2);
    const total = parseFloat(subtotal) + parseFloat(sst);

    setSubtotal(parseFloat(subtotal).toFixed(2));
    setSst(sst);
    setTotal(total.toFixed(2));
  };


  useEffect(() => {
    if (merchantid) {
      fetchCartItem();
    }
  }, [merchantid]);

  useEffect(() => {
    if (cartItems.length > 0) {
      calculate();
    }
  }, [cartItems]);

  const fetchCartItem = async () => {
    try {
      const res = await cartAPI.listCartItems(merchantid);
      const enriched = await Promise.all(
        res.map(async (item) => ({
          ...item,
          image: productAPI.fetchImage(item.product.psprdimg),
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
      <SafeAreaView style={cartStyles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );

  if (!cartItems.length)
    return (
      <SafeAreaView style={cartStyles.loading}>
        <Text>No items from this merchant in your cart.</Text>
      </SafeAreaView>
    );

  const createOrder = async () => {
    const orderPayload = {
      psordrap: "N",
      psordpap: "N",
      psmrcuid: merchantid,
    };
    const orderRes = await orderAPI.createOrder(orderPayload);
    const ordId = orderRes.message.ordId;
    // console.log("Catched ID:", ordId);

    if (orderRes.error) {
      console.log("Failed to create order:", orderRes.error);
      return;
    }
    return ordId;
  };

  const   handleOnlineCheckout = async () => {
    const createdOrdId = await createOrder();
    if (!createdOrdId) return;

    const trxRes = await transactionAPI.createOnline(createdOrdId, total, {
      returnUrl: getReturnUrl(),
    });

    if (trxRes?.url) {
      const paymentUrl = trxRes.url;

      if (Platform.OS === "web") {
        setTimeout(() => {
          console.log("Redirecting to Stripe:", paymentUrl);
          window.location.href = paymentUrl;
        }, 100);
      } else {
        const result = await WebBrowser.openAuthSessionAsync(
          paymentUrl,
          getReturnUrl() + "/checkout"
        );

        if (result.type === "success" && result.url.includes("success")) {
          console.log("Payment success");
        } else {
          console.log("Payment cancelled");
        }
      }
    } else {
      Alert.alert("Stripe session not created");
    }
  };
  const handleOfflineCheckout = async () => {
    const createdOrdId = await createOrder();
    if (!createdOrdId) return;

    const trxRes = await transactionAPI.createOffline(createdOrdId, total);
  };

  return (
    <SafeAreaView style={cartStyles.container}>
      <ScrollView
        contentContainerStyle={cartStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.map((item) => (
          <View key={item.psitmcno}>
            <View style={cartStyles.rowContainer}>
              <View>
                <View style={cartStyles.rowContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={cartStyles.productImage}
                    resizeMode="cover"
                  />
                  <View>
                    <Text style={cartStyles.name}>{item.product.psprdnme}</Text>
                    <Text style={cartStyles.price}>RM {item.psitmunt}</Text>
                    <Text style={cartStyles.quantity}>
                      Qty: {item.psitmqty}
                    </Text>
                  </View>
                </View>
                {item.psitmrmk ? (
                  <Text style={cartStyles.remark}> ** {item.psitmrmk}</Text>
                ) : null}
              </View>

              <Text style={cartStyles.subtotal}>RM {item.psitmsbt}</Text>
            </View>
            <View style={cartStyles.separator} />
          </View>
        ))}
      </ScrollView>
      <View style={cartStyles.contentContainer}>
        <View style={cartStyles.rowContainer}>
          <Text style={cartStyles.total}>Subtotal :</Text>
          <Text style={cartStyles.total}>{subtotal}</Text>
        </View>
        <View style={cartStyles.rowContainer}>
          <Text style={cartStyles.total}>SST (6%) :</Text>
          <Text style={cartStyles.total}>{sst}</Text>
        </View>
        <View style={cartStyles.separator}></View>
        <View style={cartStyles.rowContainer}>
          <Text style={cartStyles.gtotal}>TOTAL :</Text>
          <Text style={cartStyles.gtotal}>{total}</Text>
        </View>
        <View style={{ height: 100 }} />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "95%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.primary,
            borderRadius: 100,
            margin: 20,
            padding: 20,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: "600" }}>
            Checkout
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
            Choose Payment Method
          </Text>
          <TouchableOpacity
            style={{ paddingVertical: 12 }}
            onPress={() => {
              setModalVisible(false);
              handleOfflineCheckout();
            }}
          >
            <Text style={{ fontSize: 16 }}>Pay at Counter</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={{ paddingVertical: 12 }}
            onPress={() => {
              setModalVisible(false);
              handleOnlineCheckout();
            }}
          >
            <Text style={{ fontSize: 16 }}>Online Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 12 }}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Text style={{ fontSize: 16, color: "red" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      ;
    </SafeAreaView>
  );
};

export default CartDetail;
