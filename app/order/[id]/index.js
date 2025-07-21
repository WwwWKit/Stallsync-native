import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createCartStyles } from "../../../assets/styles/cart.styles";
import { createOrderStyles } from "../../../assets/styles/order.styles";
import { Colors } from "../../../constants/colors";
import { useColorScheme } from "../../../hooks/useColorScheme";
import {
  orderAPI,
  reviewAPI,
  transactionAPI,
} from "../../../services/backendAPIs";
import { getReturnUrl, showAlert } from "../../../utils/common";

const OrderDetail = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const orderStyles = createOrderStyles(scheme);
  const cartStyles = createCartStyles(scheme);
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [gtotal, setGtotal] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Order History",
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.text, // 🎨 Back button & title color
      headerTitleStyle: {
        fontWeight: "bold", // font styling
        fontSize: 25,
      },
      textAlign: "center",
    });
  }, [navigation]);

  const fetchOrder = async (orderid) => {
    try {
      const order = await orderAPI.getOrder(orderid);
      console.log("Order: ", order);
      // const enriched = order.map = (o) => ({
      //   ...o,
      //   img: merchantAPI.fetchImage(o.sfi)
      // })
      setOrder(order);
      setOrderItems(order.psorditm);
    } catch (err) {
      console.log("Failed to fetch order: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("OrderDetail id:", id);
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  useEffect(() => {
    if (Object.keys(order).length > 0) {
      calculate();
    }
  }, [order]);

  if (loading) {
    return (
      <SafeAreaView style={orderStyles.container}>
        <Text style={orderStyles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const calculate = () => {
    if (!order.psordamt || !order.psordsst) return;
    const gtotal = (
      parseFloat(order.psordamt) + parseFloat(order.psordsst)
    ).toFixed(2);
    setGtotal(gtotal);
  };

  const fetchReview = async () => {
    try {
      const res = await reviewAPI.getReview(id);
      console.log("Review response:", res);
      if (res === null) {
        router.push(`/review/create/${id}`);
      } else {
        router.push(`/review/${id}`);
      }
      
    } catch (e) {
      console.log("Failed to find review:", e);
    }
  };

  const handleOnlineCheckout = async () => {
    setLoading(true); // show spinner
    try {
      const trxRes = await transactionAPI.createOnline(id, gtotal, {
        returnUrl: getReturnUrl(),
      });
      if (!trxRes?.url) throw new Error("Payment session error");

      // Immediately redirect
      const paymentUrl = trxRes.url;
      Platform.OS === "web"
        ? (window.location.href = paymentUrl)
        : await WebBrowser.openAuthSessionAsync(
            paymentUrl,
            getReturnUrl() + "/checkout"
          );
    } catch (e) {
      console.error(e);
      showAlert("Checkout Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={orderStyles.container}>
      <View style={orderStyles.merchantContainer}>
        <Text style={orderStyles.merchantText}>{order.psmrcuiddsc}</Text>
        <Text style={orderStyles.merchantText}>{order.psmrceml}</Text>
        <Text style={orderStyles.merchantText}>{order.psmrcphn}</Text>
      </View>
      <ScrollView
        style={orderStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {orderItems.map((item) => (
          <View key={item.psitmcno}>
            <View>
              <View style={orderStyles.itemRows}>
                <Text style={orderStyles.itemText}>
                  {item.psprdnme} (RM{item.psitmunt}) * {item.psitmqty}
                </Text>
                <Text style={orderStyles.itemText}>RM{item.psitmsbt}</Text>
              </View>
              {item.psitmrmk && (
                <Text style={orderStyles.remark}>{item.psitmrmk}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={cartStyles.contentContainer}>
        <View style={cartStyles.rowContainer3}>
          <Text style={cartStyles.total}>Subtotal :</Text>
          <Text style={cartStyles.total}>{order.psordamt}</Text>
        </View>
        <View style={cartStyles.rowContainer3}>
          <Text style={cartStyles.total}>SST (6%) :</Text>
          <Text style={cartStyles.total}>{order.psordsst}</Text>
        </View>
        <View style={cartStyles.separator}></View>
        <View style={cartStyles.spacebetween}>
          <Text style={cartStyles.gtotal}>TOTAL :</Text>
          <Text style={cartStyles.gtotal}>{gtotal}</Text>
        </View>
        <View style={{ height: 100 }} />
      </View>
      {["N", "G"].includes(order.psordsts) ? (
        <View
          style={{
            position: "absolute",
            bottom: 10,
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
            onPress={handleOnlineCheckout}
          >
            <Text
              style={{ color: theme.text, fontSize: 20, fontWeight: "600" }}
            >
              Continue Payment
            </Text>
          </TouchableOpacity>
        </View>
      ) : order.psordsts === "D" ? (
        <View
          style={{
            position: "absolute",
            bottom: 10,
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
            onPress={fetchReview}
          >
            <Text
              style={{ color: theme.text, fontSize: 20, fontWeight: "600" }}
            >
              Review
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            position: "absolute",
            bottom: 10,
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
            onPress={() => router.back()}
          >
            <Text
              style={{ color: theme.text, fontSize: 20, fontWeight: "600" }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderDetail;
