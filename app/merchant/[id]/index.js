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
import { useColorScheme } from "../../../hooks/useColorScheme";
import { merchantAPI, productAPI } from "../../../services/backendAPIs";

const MerchantPage = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const categoryStyles = createCategoryStyles(scheme);

  const [merchant, setMerchant] = useState("");
  const [loading, setLoading] = useState(true);
  const [typeFilters, setTypeFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Set header styles
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Merchant Details",
      headerShown: true,
      headerStyle: {
        backgroundColor: "#6200ee",
      },
      headerTintColor: "#ffffff",
      headerTitleStyle: {
        fontWeight: "bold",
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
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!merchant) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Merchant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <ScrollView>
        <Image
          source={merchant.img ? { uri: merchant.img } : defaultImage}
          style={{ width: "100%", height: 250, borderRadius: 10 }}
          resizeMode="cover"
        />

        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>
          {merchant.psmrcnme}
        </Text>
        <Text style={{ fontSize: 16, marginTop: 8 }}>{merchant.psmrcdsc}</Text>
        <Text style={{ fontSize: 16, marginTop: 8 }}>
          Rating: {merchant.psmrcrtg}
        </Text>

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