import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import defaultImage from "../../assets/images/default.png";
import { createCategoryStyles } from "../../assets/styles/category.styles";
import GoldHeaderBackground from "../../components/GoldHeaderBackground";
import SearchBar from "../../components/SearchBar";
import { useColorScheme } from "../../hooks/useColorScheme";
import { productAPI } from "../../services/backendAPIs";

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const CategoryScreen = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const categoryStyles = createCategoryStyles(scheme);

  //Search
  const [query, setQuery] = useState("");
  //Filter
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  //infinite scroll
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  //Fetching Filter
  useEffect(() => {
  fetchFilter();
}, []);

 useEffect(() => {
  if (categoryFilters.length > 0) {
    handleFilterSelected(categoryFilters[0].code);
  } else if (typeFilters.length > 0) {
    handleFilterSelected(typeFilters[0].code);
  }
}, [categoryFilters, typeFilters]);

  const onSearch = () => {
    setShowDropdown(true);
  };

  const fetchFilter = async () => {
    try {
      const { categories, types } = await productAPI.getFilter(true, true);

      const formattedCategories = categories.map((cat, idx) => ({
        id: `cat-${idx}`,
        name: cat.desc,
        code: cat.code,
      }));

      const formattedTypes = types.map((typ, idx) => ({
        id: `typ-${idx}`,
        name: typ.desc,
        code: typ.code,
      }));

      setCategoryFilters(formattedCategories);
      setTypeFilters(formattedTypes);
    } catch (error) {
      console.error("Error loading filter data:", error);
    }
  };

  const handleFilterSelected = async (code) => {
    setSelectedFilter(code);
    setPage(0);
    setHasMore(true);

    try {
      // Try filter by category first
      const isCategory = categoryFilters.some((cat) => cat.code === code);
      let results = [];

      const params = { page: 0, limit: 10 };

      if (isCategory) {
        results = await productAPI.listByCategory(code, params);
      } else {
        results = await productAPI.listByType(code, params);
      }

      const enriched = results.map((p) => ({
        ...p,
        image: productAPI.fetchImage(p.psprdimg),
      }));

      setFilteredProducts(enriched);
      if (results.length < 10) setHasMore(false);
      // console.log("Filtered products:", enriched);
    } catch (err) {
      console.error("Failed to filter products:", err);
    }
  };

  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const isCategory = categoryFilters.some(
        (cat) => cat.code === selectedFilter
      );
      let results = [];

      const params = { page: nextPage, limit: 10 };

      if (selectedFilter === "ALL") {
        results = await productAPI.listProducts("", params);
      } else if (isCategory) {
        results = await productAPI.listByCategory(selectedFilter, params);
      } else {
        results = await productAPI.listByType(selectedFilter, params);
      }

      const enriched = results.map((p) => ({
        ...p,
        image: productAPI.fetchImage(p.psprdimg),
      }));

      setFilteredProducts((prev) => [...prev, ...enriched]);
      setPage(nextPage);
      if (results.length < 10) setHasMore(false);
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearchTyping = async (text) => {
    setQuery(text);

    if (text.length > 0) {
      const productResults = await productAPI.listProducts(text);

      const enrichedProducts = productResults.map((p) => ({
        ...p,
        img: productAPI.fetchImage(p.psprdimg),
      }));

      setSuggestions(enrichedProducts);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setSuggestions([]);
    }
  };

  return (
    <SafeAreaView style={categoryStyles.container}>
      <GoldHeaderBackground />
      <SearchBar
        value={query}
        onChangeText={handleSearchTyping}
        onSearch={onSearch}
      />

      {showDropdown && (
        <View
          style={{
            position: "absolute",
            top: 80,
            left: 16,
            right: 16,
            backgroundColor: "white",
            marginHorizontal: 16,
            marginTop: 4,
            borderRadius: 10,
            padding: 10,
            elevation: 4,
            zIndex: 999,
          }}
        >
          <ScrollView
            style={{ maxHeight: 500 }}
            keyboardShouldPersistTaps="handled"
          >
            {suggestions.length > 0 && (
              <>
                {suggestions.map((p) => (
                  <TouchableOpacity
                    key={p.psprduid}
                    style={{
                      flexDirection: "row",
                      marginBottom: 8,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      router.push(`/product/${p.psprduid}`);
                      setShowDropdown(false);
                      setQuery("");
                    }}
                  >
                    <Image
                      source={p.img ? { uri: p.img } : defaultImage}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        marginRight: 10,
                      }}
                    />
                    <View>
                      <Text>{p.psprdnme}</Text>
                      <Text
                        style={{ fontSize: 12, color: "#888" }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {p.psmrcuiddsc}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      )}

      <View style={categoryStyles.categoryFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={categoryStyles.categoryFilterScrollContent}
        >

          {categoryFilters.map((filter) => {
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

          {typeFilters.map((filter) => {
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

      <View style={categoryStyles.listContainer}>
        <View style={categoryStyles.listContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={onRefresh}
            //     tintColor={COLORS.primary}
          >
            <FlatList
              data={filteredProducts}
              keyExtractor={(p) => p.psprduid}
              contentContainerStyle={categoryStyles.list}
              onEndReached={loadMoreProducts}
              onEndReachedThreshold={0.6}
              ListFooterComponent={
                isLoadingMore ? (
                  <Text style={{ textAlign: "center" }}>Loading more...</Text>
                ) : null
              }
              renderItem={({ item: p }) => (
                <TouchableOpacity
                  key={p.psprduid}
                  onPress={() => router.push(`/product/${p.psprduid}`)}
                >
                  {/* Row */}
                  <View style={categoryStyles.cardContainer}>
                    {/* at left */}
                    <Image
                      source={p.image ? { uri: p.image } : defaultImage}
                      style={categoryStyles.cardImage}
                    />
                    <View style={categoryStyles.detailContainer}>
                      {/* at right as a column */}
                      <View>
                        <Text
                          style={categoryStyles.nameText}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {p.psprdnme}
                        </Text>
                        <Text
                          style={categoryStyles.merchantText}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {p.psmrcuiddsc}
                        </Text>
                      </View>

                      <Text
                        style={categoryStyles.priceText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {`RM ${parseFloat(p.psprdpri).toFixed(2)}`}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;
