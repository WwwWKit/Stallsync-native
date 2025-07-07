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

  if (!merchant) {
    return (
      <SafeAreaView
        style={mrcStyles.loading}
      >
        <Text>Merchant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={mrcStyles.container}>
      <ScrollView style={mrcStyles.ScrollContainer}>
        <Image
          source={merchant.img ? { uri: merchant.img } : defaultImage}
          style={mrcStyles.image}
          resizeMode="cover"
        />

        <Text style={mrcStyles.name}>{merchant.psmrcnme}</Text>

        <View style={mrcStyles.ratingRow}>
          <Text style={mrcStyles.rating}>
            {`${parseFloat(merchant.psmrcrtg).toFixed(1)}`}
          </Text>
          <FontAwesome5 name="star" size={18} color={theme.primary} solid />
        </View>

        <View style={mrcStyles.rowContainer}>
          {merchant.psmrclbl?.map((tag) => (
            <View key={tag.key} style={mrcStyles.label}>
              <Text style={{ fontSize: 12, fontWeight: "500" }}>
                {tag.label}
              </Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 16, marginTop: 8 }}>{merchant.psmrcdsc}</Text>

        {/* Type Filters */}
        <View style={categoryStyles.categoryFilterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={categoryStyles.categoryFilterScrollContent}
          >
            {typeFilters.length > 0 &&
              typeFilters.map((filter) => {
                const isSelected = selectedFilter === filter.code;
                return (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      categoryStyles.categoryButton,
                      isSelected && categoryStyles.selectedCategory,
                    ]}
                    onPress={() => handleFilterSelected(filter.code)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        categoryStyles.categoryText,
                        isSelected && categoryStyles.selectedCategoryText,
                      ]}
                    >
                      {filter.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>

        {/* Filtered Products */}
        <View style={{ marginTop: 16 }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <View
                key={product.psprdcod}
                style={{
                  marginBottom: 16,
                  backgroundColor: "#f9f9f9",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={{ uri: product.image }}
                  style={{ width: "100%", height: 180, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginTop: 8 }}
                >
                  {product.psprdnam}
                </Text>
                <Text style={{ color: "#666", marginTop: 4 }}>
                  {product.psprddsc}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ marginTop: 16, textAlign: "center", color: "#999" }}>
              No products found.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MerchantPage;
