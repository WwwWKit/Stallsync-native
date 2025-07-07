import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-web";
import { Colors } from "../../../constants/colors";
import { useColorScheme } from "../../../hooks/useColorScheme";
import { merchantAPI, orderAPI } from "../../../services/backendAPIs";


const OrderDetail = () => {
  const { orderid } = useLocalSearchParams();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("");



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
      fetchOrder();
    }, []);

const fetchOrder = async () =>  {
  try {
    const order = await orderAPI.getOrder(orderid);
    const enriched = order.map = (o) => ({
      ...o,
      img: merchantAPI.fetchImage(o.sfi)
    })
    isSetAccessorDeclaration(enriched);
  } catch (err) {
    console.log("Failed to fetch order: ", err)
  } finally {
    setLoading(false);
  }
}  


  return (
    <SafeAreaView>
      <ScrollView>
        
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderDetail;