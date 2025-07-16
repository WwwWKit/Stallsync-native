import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import defaultImage from "../../assets/images/default.png";
import { createCartStyles } from "../../assets/styles/cart.styles";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { cartAPI, merchantAPI } from "../../services/backendAPIs";

const CartOverview = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const cartStyles = createCartStyles(scheme);

  const [merchantList, setMerchantList] = useState([]);
  const [itemList, setItemList] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Cart",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary, color: theme.text },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 25 },
    });
  }, [navigation]);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const merchants = await cartAPI.listMerchant();
      const enriched = await Promise.all(
        merchants.map(async (m) => ({
          ...m,
          img: merchantAPI.fetchImage(m.psmrcsfi),
        }))
      );

      setMerchantList(enriched);

      // Fetch cart items per merchant
      const itemsByMerchant = {};
      await Promise.all(
        enriched.map(async (m) => {
          const res = await cartAPI.listCartItems(m.psmrcuid);
          const items = res.items;
          itemsByMerchant[m.psmrcuid] = items;
        })
      );
      setItemList(itemsByMerchant);
    } catch (err) {
      console.error("Failed to fetch merchants or items:", err);
    }
  };

  const handleMerchantPress = (merchantid) => {
    router.push(`/cart/${merchantid}`);
  };

  return (
    <SafeAreaView style={cartStyles.container}>
      <ScrollView contentContainerStyle={cartStyles.scrollContainer}>
        {merchantList.length === 0 ? (
          <View>
            <Text style={cartStyles.emptyString}>
              Your cart is currently empty.
            </Text>
          </View>
        ) : (
          merchantList.map((merchant, idx) => {
            const items = itemList[merchant.psmrcuid] || [];
            return (
              <View key={merchant.psmrcuid} style={cartStyles.card}>
                <TouchableOpacity
                  onPress={() => handleMerchantPress(merchant.psmrcuid)}
                >
                  <View style={cartStyles.flexstart}>
                    <Text style={cartStyles.index}>{idx + 1}</Text>

                    <View style={cartStyles.flex}>
                      <View style={cartStyles.flexstart}>
                        <Image
                          source={
                            merchant.img ? { uri: merchant.img } : defaultImage
                          }
                          style={cartStyles.image}
                          resizeMode="cover"
                        />
                        <View>
                          <Text style={cartStyles.name}>
                            {merchant.psmrcnme}
                          </Text>
                          <Text style={cartStyles.subName}>
                            {items.length} item(s) in cart
                          </Text>
                        </View>
                      </View>
                      <View style={cartStyles.separator} />
                      <View style={cartStyles.itemListContainer}>
                        {items.slice(0, 5).map((item) => (
                          <Text key={item.psitmcno} style={cartStyles.item}>
                            - {item.product.psprdnme} x{item.psitmqty}
                          </Text>
                        ))}
                        {items.length > 5 && (
                          <Text style={cartStyles.andmore}>... and more</Text>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartOverview;
