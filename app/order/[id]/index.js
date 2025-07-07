import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-web";
import { Colors } from "../../../constants/colors";
import { useColorScheme } from "../../../hooks/useColorScheme";


const OrderDetail = () => {
  const { orderid } = useLocalSearchParams();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const [loading, setLoading] = useState(true);



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
    const order = await orderAPI.getOrder(orderId);
    
  }
}  


  return (
    <SafeAreaView>
      <ScrollView>
        
      </ScrollView>
    </SafeAreaView>
  )
}