import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
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
  View
} from "react-native";
import { TextInput } from "react-native-web";
import defaultImage from "../../../assets/images/default.png";
import { createProductStyles } from "../../../assets/styles/prddetail.styles";
import { Colors } from "../../../constants/colors";
import { useColorScheme } from "../../../hooks/useColorScheme";
import { cartAPI, productAPI } from "../../../services/backendAPIs";

const ProductPage = () => {
  const { id } = useLocalSearchParams(); // grabs the dynamic ID from the URL
  const navigation = useNavigation();

  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const productStyles = createProductStyles(scheme);

  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(true);
  const [itemqty, setItemqty] = useState(1);
  const [remark, setRemark] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Product Details",
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
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const showAlert = (message) => {
  if (Platform.OS === "web") {
    alert(message); // browser-native alert
  } else {
    Alert.alert(message);
  }
};

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
      showAlert("Item added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      showAlert("Failed to add to cart");
    }
  };
  if (loading) {
    return (
      <SafeAreaView
        style={productStyles.loading}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView
        style={productStyles.loading}
      >
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={productStyles.container}>
      <ScrollView style={productStyles.scrollContainer}>
        <Image
          source={product.img ? { uri: product.img } : defaultImage}
          style={productStyles.image}
          resizeMode="cover"
        />
        <View style={productStyles.detailContainer}>
          <Text style={productStyles.name}>{product.psprdnme}</Text>
          <Text style={productStyles.merchant}>{product.psmrcuiddsc}</Text>

          <View style={productStyles.rowContainer}>
            <View style={productStyles.label}>
              <Text>{product.psprdtypdsc}</Text>
            </View>
            <View style={productStyles.label}>
              <Text>{product.psprdcatdsc}</Text>
            </View>
          </View>
          <Text style={productStyles.description}>
            {product.psprddsc || "No description."}
          </Text>

          <View style={productStyles.rowContainer}>
            <Text style={productStyles.price}>{`RM ${parseFloat(
              product.psprdpri
            ).toFixed(2)}`}</Text>

            <View style={productStyles.rowContainer}>
              <TouchableOpacity
                style={productStyles.qtyButton}
                onPress={() => setItemqty((prev) => Math.max(1, prev - 1))}
              >
                <Text style={productStyles.btnSign}>-</Text>
              </TouchableOpacity>
              <Text style={productStyles.quantity}>{itemqty}</Text>
              <TouchableOpacity
                style={productStyles.qtyButton}
                onPress={() => setItemqty(itemqty + 1)}
              >
                <Text style={productStyles.btnSign}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            value={remark}
            onChangeText={setRemark}
            placeholder="Add remark"
            keyboardType="default"
            style={productStyles.remark}
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>



      <View style={productStyles.addButtonContainer}>
        <TouchableOpacity
          style={productStyles.addToCart}
          onPress={() =>
            addCart({
              psmrcuid: product.psmrcuid,
              psprduid: product.psprduid,
              psitmqty: itemqty,
              psitmrmk: remark,
            })
          }
        >
          <Text style={productStyles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductPage;
