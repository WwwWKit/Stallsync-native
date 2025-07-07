import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import defaultImage from "../../../assets/images/default.png";
import { createCategoryStyles } from "../../../assets/styles/category.styles";
import { createMrcDetailStyles } from "../../../assets/styles/mrcdetail.styles";
import { Colors } from "../../../constants/colors";
import { useColorScheme } from "../../../hooks/useColorScheme";
import { merchantAPI, productAPI } from "../../../services/backendAPIs";

const MerchantPage = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const mrcStyles = createMrcDetailStyles(scheme);
  const categoryStyles = createCategoryStyles(scheme);

  const [merchant, setMerchant] = useState("");
  const [loading, setLoading] = useState(true);
  const [typeFilters, setTypeFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Set header styles
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Merchant Detail",
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

  // Fetch merchant and filters
  useEffect(() => {
    if (id) {
      fetchMerchant();
      fetchFilter();
    }
  }, [id]);

  // When filters are loaded, auto-select the first one
  useEffect(() => {
    if (typeFilters.length > 0) {
      handleFilterSelected(typeFilters[0].code);
    }
  }, [typeFilters]);

  const fetchMerchant = async () => {
    try {
      const res = await merchantAPI.getMerchant(id);
      const enriched = {
        ...res,
        img: merchantAPI.fetchImage(res.psmrcsfi),
      };
      console.log("Merchant", enriched);
      setMerchant(enriched);
    } catch (error) {
      console.log("Failed to load merchant:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilter = async () => {
    try {
      const allProducts = await productAPI.listByMerchant(id);
      console.log("Product by merchant", allProducts);

      const uniqueTypes = [...new Set(allProducts.map((p) => p.psprdtyp))];

      const { types } = await productAPI.getFilter(false, true);
      const filteredTypes = types.filter((typ) =>
        uniqueTypes.includes(typ.code)
      );
      const formattedTypes = filteredTypes.map((typ, idx) => ({
        id: idx,
        name: typ.desc,
        code: typ.code,
      }));
      setTypeFilters(formattedTypes);

      if (formattedTypes.length > 0) {
        handleFilterSelected(formattedTypes[0].code);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading filter data:", error);
    }
  };

  const handleFilterSelected = async (code) => {
    setSelectedFilter(code);
    try {
      const res = await productAPI.listByMerchantAndType(id, code);
      const enriched = res.map((p) => ({
        ...p,
        image: productAPI.fetchImage(p.psprdimg),
      }));

      setFilteredProducts(Array.isArray(enriched) ? enriched : []);
    } catch (err) {
      console.error("Failed to filter products:", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={mrcStyles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView
        style={mrcStyles.loading}
        contentContainerStyle={mrcStyles.contentContainer}
      >
        <Text>Order not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={mrcStyles.container}>
      <ScrollView style={mrcStyles.ScrollContainer}>
     
      </ScrollView>
    </SafeAreaView>
  );
};

export default MerchantPage;
