import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
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

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

useEffect(() => {
  if (Object.keys(order).length > 0) {
    calculate();
  }
}, [order]);

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

  const calculate = () => {
    if (!order.total || !order.psordsst) return;
    const gtotal = (
      parseFloat(order.total) - parseFloat(order.psordsst)
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
        showVerticalScrollIndicator={false}
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
              <Text style={orderStyles.remark}>
                {item.psitmrmk ? item.psitmrmk : null}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={cartStyles.contentContainer}>
        <View style={cartStyles.rowContainer}>
          <Text style={cartStyles.total}>Subtotal :</Text>
          <Text style={cartStyles.total}>{order.total}</Text>
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
                <Text style={{ color: theme.text, fontSize: 20, fontWeight: "600" }}>
                  Continue Payment
                </Text>
              </TouchableOpacity>
            </View>
    </SafeAreaView>
  );
};

export default OrderDetail;
