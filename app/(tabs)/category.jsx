import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import defaultImage from "../../assets/images/default.png";
import { createCategoryStyles } from "../../assets/styles/category.styles";
import { createRecommendStyles } from "../../assets/styles/home.styles";
import GoldHeaderBackground from "../../components/GoldHeaderBackground";
import SearchBar from "../../components/SearchBar";
import { useColorScheme } from "../../hooks/useColorScheme";
import { productAPI } from "../../services/backendAPIs";

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const CategoryScreen = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const categoryStyles = createCategoryStyles(scheme);
  const listingStyles = createRecommendStyles(scheme);

  //Search
  const [query, setQuery] = useState("");
  //Filter
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [filteredProducts, setFilteredProducts] = useState([]);

  //Fetching Filter
  useEffect(() => {
    fetchFilter();
    handleFilterSelected("ALL");
  }, []);

  const onSearch = () => {
    const filtered = recommendation.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
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

    try {
      // Try filter by category first
      const isCategory = categoryFilters.some((cat) => cat.code === code);
      let results = [];

      if (code === "ALL") {
        results = await productAPI.listProducts("");
      } else if (isCategory) {
        results = await productAPI.listByCategory(code);
      } else {
        results = await productAPI.listByType(code);
      }

      const enriched = results.map((p) => ({
        ...p,
        image: productAPI.fetchImage(p.psprdimg),
      }))

      setFilteredProducts(Array.isArray(enriched) ? enriched : []);
      // console.log("Filtered products:", enriched);
    } catch (err) {
      console.error("Failed to filter products:", err);
    }
  };

  return (
    <SafeAreaView style={categoryStyles.container}>
      <GoldHeaderBackground />
      <SearchBar value={query} onChangeText={setQuery} onSearch={onSearch} />

      <View style={categoryStyles.categoryFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={categoryStyles.categoryFilterScrollContent}
        >
          <TouchableOpacity
            style={[
              categoryStyles.categoryButton,
              selectedFilter === "ALL" && categoryStyles.selectedCategory,
            ]}
            onPress={() => handleFilterSelected("ALL")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                categoryStyles.categoryText,
                selectedFilter === "ALL" && categoryStyles.selectedCategoryText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
              
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
        <View
       style={categoryStyles.listContainer}
        >
          <ScrollView
          showsVerticalScrollIndicator={false}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={onRefresh}
          //     tintColor={COLORS.primary}
          >
            <View style={ categoryStyles.list}>
            {filteredProducts.map((p) => (
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
            ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;
