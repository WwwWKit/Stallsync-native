import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { createCartStyles } from '../../assets/styles/cart.styles';
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { merchantAPI, orderAPI } from "../../services/backendAPIs";

const OrderOverview = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const mrcStyles = createCartStyles(scheme);

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  // Set header styles
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
    });
  }, [navigation]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const Orders = await orderAPI.listOrders();
      console.log("Orders:", Orders);
      const enriched = await Promise.all(
        Orders.map(async (o) => ({
          ...o,
          img: await merchantAPI.fetchImage(o.sfi),
        }))
      );
      console.log("enriched", enriched);
      setOrders(enriched);
    } catch (err) {
      console.log("Failed to fetch orders:", err);
    }finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <SafeAreaView style={mrcStyles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!orders) {
    return (
      <SafeAreaView style={mrcStyles.loading}>
        <Text>Orders not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={mrcStyles.container}>
      <ScrollView style={mrcStyles.ScrollContainer}>
        {orders.map((order) => (
          <TouchableOpacity key={order.psorduid}>
            <View>
              <Text>{order.psmrcuiddsc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderOverview;
