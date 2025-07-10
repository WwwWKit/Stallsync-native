import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  View,
} from "react-native";
import defaultImage from "../../../assets/images/default.png";
import { createCategoryStyles } from "../../../assets/styles/category.styles";
import { createMrcDetailStyles } from "../../../assets/styles/mrcdetail.styles";
import { Colors } from "../../../constants/colors";
import { useColorScheme } from "../../../hooks/useColorScheme";
import { cartAPI, merchantAPI, productAPI } from "../../../services/backendAPIs";
import { showAlert } from "../../../constants/common";

const MerchantPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const mrcStyles = createMrcDetailStyles(scheme);
  const categoryStyles = createCategoryStyles(scheme);

  const [merchant, setMerchant] = useState("");
  const [loading, setLoading] = useState(true);
  const [typeFilters, setTypeFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);


  // Set header styles
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Merchant Details",
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
      const allProducts = await productAPI.listByMerchant(id); // products by merchant


      const enrichedProducts = allProducts.map((p) => ({
      ...p,
      image: productAPI.fetchImage(p.psprdimg),
    }));

    setAllProducts(enrichedProducts);

      const { types } = await productAPI.getFilter(false, true); // global types

      const usedTypeCodes = [
      ...new Set(allProducts.map((p) => p.psprdtyp).filter(Boolean)), //merchant used types
    ];

      const merchantTypes = types.filter((type) =>
      usedTypeCodes.includes(type.code)
    );

      const formattedTypes = merchantTypes.map((typ, idx) => ({
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
    const filtered = allProducts.filter((p) => p.psprdtyp === code);
    setFilteredProducts(filtered);
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
      <SafeAreaView style={mrcStyles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!merchant) {
    return (
      <SafeAreaView style={mrcStyles.loading}>
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

        <Text style={{ fontSize: 16, marginVertical: 16 }}>
          {merchant.psmrcdsc}
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
              <TouchableOpacity
                key={product.psprduid}
                onPress={() => router.push(`/product/${product.psprduid}`)}
                style={{
                  marginBottom: 16,
                  backgroundColor: "#f9f9f9",
                  padding: 10,
                  borderRadius: 10,
                  position: "relative", // important for absolute positioning inside
                }}
              >
                <View>
                  <Image
                    source={{ uri: product.image }}
                    style={{ width: "100%", height: 180, borderRadius: 10 }}
                    resizeMode="cover"
                  />{" "}
                  <TouchableOpacity
                    onPress={() =>
                      addCart({
                        psmrcuid: product.psmrcuid,
                        psprduid: product.psprduid,
                        psitmqty: 1,
                        psitmrmk: null,
                      })
                    }
                    style={{
                      position: "absolute",
                      bottom: 20,
                      right: 20,
                      backgroundColor: theme.primary,
                      borderRadius: 30,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={"add"}
                      size={20}
                      color={theme.white}
                      style={{ padding: 15 }}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginTop: 8 }}
                >
                  {product.psprdnme}
                </Text>
                <Text style={{ color: "#666", marginTop: 4 }}>
                  {product.psprddsc}
                </Text>
              </TouchableOpacity>
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
