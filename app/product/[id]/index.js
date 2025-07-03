import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-web";
import defaultImage from "../../../assets/images/default.png";
import { cartAPI, productAPI } from "../../../services/backendAPIs";

const ProductPage = () => {
  const { id } = useLocalSearchParams(); // grabs the dynamic ID from the URL
  const navigation = useNavigation();
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(true);
  const [itemqty, setItemqty] = useState(1);
  const [remark, setRemark] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Product Details",
      headerShown: true,
      headerStyle: {
        backgroundColor: "#6200ee",
      },
      headerTintColor: "#ffffff", // 🎨 Back button & title color
      headerTitleStyle: {
        fontWeight: "bold", // Optional styling
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await productAPI.getProduct(id);
      const enriched = {
        ...res,
        img: productAPI.fetchImage(res.psprdimg),
      };
      setProduct(enriched);
    } catch (error) {
      console.error("Failed to load product:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCart = async (cartItem) => {
    try {
      await cartAPI.addCartItem(cartItem);
      Alert.alert("Item added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      Alert.alert("Failed to add to cart");
    }
  };
  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 16 }}>
        <Image
          source={product.img ? { uri: product.img } : defaultImage}
          style={{ width: "100%", height: 250, borderRadius: 10 }}
          resizeMode="cover"
        />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>
          {product.psprdnme}
        </Text>
        <Text style={{ fontSize: 16, color: "#888", marginBottom: 10 }}>
          {product.psmrcuiddsc}
        </Text>
        <Text style={{ fontSize: 20 }}>{`RM ${parseFloat(
          product.psprdpri
        ).toFixed(2)}`}</Text>
        <Text style={{ marginTop: 20 }}>
          {product.psprddsc || "No description."}
        </Text>
        <View
          styles={{
            marginTop: 20,
            position: "relative",
          }}
        >
          <TextInput
            value={remark}
            onChangeText={setRemark}
            placeholder="Add remark"
            keyboardType="default"
            style={{
              fontSize: 16,
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderRadius: 12,
              borderWidth: 1,
            }}
          />
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#008080",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
            onPress={() => setItemqty((prev) => Math.max(1, prev - 1))}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginRight: 10,
            }}
          >
            {itemqty}
          </Text>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#008080",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
            onPress={() => setItemqty(itemqty + 1)}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{
          position: "absolute",
          width: 250,
          height: 70,
          bottom: 30,
          right: 70,
          left: 35,
          backgroundColor: "#008080",
          padding: 10,
          borderRadius: 35,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() =>
          addCart({
            psmrcuid: product.psmrcuid,
            psprduid: product.psprduid,
            psitmqty: itemqty,
            psitmrmk: remark,
          })
        }
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          Add to Cart
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProductPage;
