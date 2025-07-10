import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { createCartStyles } from "../../../assets/styles/cart.styles";
import { createOrderStyles } from "../../../assets/styles/order.styles";
import { Colors } from "../../../constants/colors";
import { useColorScheme } from "../../../hooks/useColorScheme";
import { orderAPI } from "../../../services/backendAPIs";

const OrderDetail = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const orderStyles = createOrderStyles(scheme);
  const cartStyles = createCartStyles(scheme);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

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
        <View style={cartStyles.rowContainer}>
          <Text style={cartStyles.total}>Subtotal :</Text>
          <Text style={cartStyles.total}>{order.psordamt}</Text>
        </View>
        <View style={cartStyles.rowContainer}>
          <Text style={cartStyles.total}>SST (6%) :</Text>
          <Text style={cartStyles.total}>{order.psordsst}</Text>
        </View>
        <View style={cartStyles.separator}></View>
        <View style={cartStyles.rowContainer}>
          <Text style={cartStyles.gtotal}>TOTAL :</Text>
          <Text style={cartStyles.gtotal}>{gtotal}</Text>
        </View>
        <View style={{ height: 100 }} />
      </View>
      {["N", "G", "C"].includes(order.psordsts) ? (
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
            onPress={() => setModalVisible(true)}
          >
            <Text
              style={{ color: theme.text, fontSize: 20, fontWeight: "600" }}
            >
              Continue Payment
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
    </SafeAreaView>
  );
};

export default OrderDetail;
