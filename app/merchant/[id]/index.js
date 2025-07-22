import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import {
  cartAPI,
  merchantAPI,
  productAPI,
  reviewAPI,
} from "../../../services/backendAPIs";
import { showAlert } from "../../../utils/common";

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
  const [tab, setTab] = useState("menu"); // "menu" or "review"
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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

  useEffect(() => {
    if (tab === "review" && id) {
      fetchReviews();
    }
  }, [tab]);

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

  // const fetchReviews = async () => {
  //   try {
  //     const res = await reviewAPI.listReviews(id);

  //     if (res && res.data) {
  //       setReviews(res.data);
  //     }
  //   } catch (err) {
  //     console.error("Failed to load reviews:", err);
  //   }
  // };

  const fetchReviews = async (nextPage = 0) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await reviewAPI.listReviews(id, {
        page: nextPage,
        limit: 10,
      });

      if (res?.data) {
        const newReviews = res.data;
        const total = res.total;

        // Combine with existing ones
        setReviews((prev) => [...prev, ...newReviews]);

        // Stop loading if all items loaded
        if ((nextPage + 1) * 10 >= total) {
          setHasMore(false);
        } else {
          setPage(nextPage + 1);
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilter = async () => {
    try {
      const allProducts = await productAPI.listByMerchant(id); // products by merchant
      console.log(allProducts);

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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => setTab("menu")}
            style={{
              backgroundColor: tab === "menu" ? theme.primary : "#ccc",
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 20,
              marginHorizontal: 10,
            }}
          >
            <Text style={{ color: tab === "menu" ? "white" : "black" }}>
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("review")}
            style={{
              backgroundColor: tab === "review" ? theme.primary : "#ccc",
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 20,
              marginHorizontal: 10,
            }}
          >
            <Text style={{ color: tab === "review" ? "white" : "black" }}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {tab === "menu" ? (
          <>
            {/* Type Filters */}
            <View style={categoryStyles.categoryFilterContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={
                  categoryStyles.categoryFilterScrollContent
                }
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
                    </View>

                    <Text
                      style={{ fontSize: 18, fontWeight: "bold", marginTop: 8 }}
                    >
                      {product.psprdnme}
                    </Text>
                    <Text style={{ color: "#666", marginTop: 4 }}>
                      {product.psprddsc}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        margin: 8,
                        marginBottom: 2,
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: "bold",
                          alignSelf: "center",
                        }}
                      >
                        RM {product.psprdpri}
                      </Text>
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
                  </TouchableOpacity>
                ))
              ) : (
                <Text
                  style={{ marginTop: 16, textAlign: "center", color: "#999" }}
                >
                  No products found.
                </Text>
              )}
            </View>
          </>
        ) : (
          <View style={{ marginTop: 16 }}>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    marginBottom: 12,
                    padding: 12,
                    borderRadius: 10,
                    borderColor: "#eee",
                    borderWidth: 1,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <FontAwesome5 name="star" size={16} color="#f1c40f" />
                    <Text style={{ fontWeight: "bold", marginLeft: 6 }}>
                      {review.psrvwrtg}/5
                    </Text>
                  </View>
                  <Text style={{ fontWeight: "bold" }}>{review.crtuser}</Text>
                  <Text style={{ color: "#333", marginBottom: 6 }}>
                    {review.psrvwdsc}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#888" }}>
                    {review.updatedAt}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", color: "#888" }}>
                No reviews yet.
              </Text>
            )}
            {reviews.length > 0 ? (
            <TouchableOpacity
                  onPress={() => fetchReviews(page)}
                  disabled={!hasMore || loading}
                >
                  <Text style={{ textAlign: "center", padding: 10 }}>
                    {loading
                      ? "Loading..."
                      : hasMore
                      ? "Load more"
                      : "No more reviews"}
                  </Text>
                </TouchableOpacity>
            ): null
            }
            
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MerchantPage;
