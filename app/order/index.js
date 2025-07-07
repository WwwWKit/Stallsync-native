import { useNavigation } from "@react-navigation/native";
import { useRouter } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { createCartStyles } from '../../assets/styles/cart.styles';
import { createOrderStyles } from '../../assets/styles/order.styles';
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { merchantAPI, orderAPI } from "../../services/backendAPIs";

const OrderOverview = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const mrcStyles = createCartStyles(scheme);
  const orderStyles = createOrderStyles(scheme);

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

      const enriched =
        Orders.map((o) => ({
          ...o,
          img: merchantAPI.fetchImage(o.sfi),
        }));

      setOrders(enriched);
    } catch (err) {
      console.log("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <SafeAreaView style={orderStyles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!orders) {
    return (
      <SafeAreaView style={orderStyles.loading}>
        <Text>Orders not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={orderStyles.container}>
      <ScrollView style={orderStyles.scrollContainer}>
        {orders.map((order) => (
          <TouchableOpacity
            key={order.psorduid}
            onPress={() => router.push(`/order/${order.psorduid}`)}
          >
            <View style={orderStyles.card}>
              <Text>{order.psordodt}</Text>
              <View style={orderStyles.detailContainer}>
                <View style={orderStyles.rowContainer}>
                  <Image
                    source={order.img ? { uri: order.img } : ""}
                    resizeMode="cover"
                    style={orderStyles.image}
                  />
                  <View style={orderStyles.nameContainer}>
                    <Text
                      style={orderStyles.name}
                      ellipsizeMode="tail"
                      numberOfLines={2}
                    >{order.psmrcuiddsc}</Text>
                  </View>
                </View>
                <View style={orderStyles.statusContainer}>
                  <Text style={orderStyles.status}>Successful</Text>
                  <Text style={orderStyles.price}>RM{order.psordgra}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderOverview;
