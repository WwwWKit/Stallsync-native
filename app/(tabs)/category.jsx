import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BBQimg from "../../assets/images/BBQ.png";
import { createCategoryStyles } from "../../assets/styles/category.styles";
import GoldHeaderBackground from "../../components/ui/GoldHeaderBackground";
import SearchBar from "../../components/ui/SearchBar";
import { useColorScheme } from "../../hooks/useColorScheme";
import { productAPI } from "../../services/backendAPIs";
const sampleProducts = [
  {
    id: "1",
    name: "Classic Burger",
    image: BBQimg,
  },
  {
    id: "2",
    name: "Veggie Delight",
    image: BBQimg,
  },
  {
    id: "3",
    name: "Cheese Overload",
    image: BBQimg,
  },
  {
    id: "4",
    name: "Spicy Wings",
    image: BBQimg,
  },
];

const categoriesData = [
  {
    id: "1",
    name: "Classic Burger",
    image: BBQimg,
  },
  {
    id: "2",
    name: "Veggie Delight",
    image: BBQimg,
  },
  {
    id: "3",
    name: "Cheese Overload",
    image: BBQimg,
  },
  {
    id: "4",
    name: "Spicy Wings",
    image: BBQimg,
  },
];

const recommendationData = [
  {
    id: "1",
    name: "Classic Burger",
    image: BBQimg,
    price: "RM10.00",
    merchant: "Masakan Malaysia",
  },
  {
    id: "2",
    name: "Veggie Delight",
    image: BBQimg,
    price: "RM10.00",
    merchant: "Masakan Malaysia",
  },
  {
    id: "3",
    name: "Cheese Overload",
    image: BBQimg,
    price: "RM10.00",
    merchant: "Masakan Malaysia",
  },
  {
    id: "4",
    name: "Spicy Wings",
    image: BBQimg,
    price: "RM10.00",
    merchant: "Masakan Malaysia",
  },
  {
    id: "5",
    name: "Classic Burger",
    image: BBQimg,
    price: "RM10.00",
    merchant: "Masakan Malaysia",
  },
  {
    id: "6",
    name: "Veggie Delight",
    image: BBQimg,
    price: "RM10.00",
    merchant: "Masakan Malaysia",
  },
  {
    id: "7",
    name: "Cheese Overload",
    image: BBQimg,
    price: "RM10.00",
    merchant: "Masakan Malaysia",
  },
  {
    id: "8",
    name: "Spicy Wings",
    image: BBQimg,
    price: "RM10.00",
    merchant: "Masakan Malaysia",
  },
];

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const CategoryScreen = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const categoryStyles = createCategoryStyles(scheme);

  const [categories] = useState(categoriesData);
  const [recommendation] = useState(recommendationData);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState(sampleProducts);
  const [categoryFilters, setCategoryFilters] = useState([]);
const [typeFilters, setTypeFilters] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const onSearch = () => {
    const filtered = sampleProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setProducts(filtered);
  };

const fetchFilter = async () => {
  const { categories, types } = await productAPI.filterByCategoryOrType(true, true);

  const formattedCategories = categories.map((cat, idx) => ({
    id: `cat-${idx}`,
    name: cat.desc,   // use desc for display
    code: cat.code,
  }));

  const formattedTypes = types.map((typ, idx) => ({
    id: `typ-${idx}`,
    name: typ.desc,
    code: typ.code,
  }));

  setCategoryFilters(formattedCategories); // set state for category filter list
  setTypeFilters(formattedTypes);          // set state for type filter list
};

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
  };

  //  const loadCategoryData = async (category) => {
  //   try {
  //     const meals = await MealAPI.filterByCategory(category);
  //     const transformedMeals = meals
  //       .map((meal) => MealAPI.transformMealData(meal))
  //       .filter((meal) => meal !== null);
  //     setRecipes(transformedMeals);
  //   } catch (error) {
  //     console.error("Error loading category data:", error);
  //     setRecipes([]);
  //   }
  // };

  
  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   // await sleep(2000);
  //   await loadData();
  //   setRefreshing(false);
  // };

  // useEffect(() => {
  //   loadData();
  // }, []);

// if (loading && !refreshing) return <LoadingSpinner message="Loading delicions recipes..." />;

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
          {filters.map((filter) => {
            const isSelected = selectedCategory === filter.name;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  categoryStyles.categoryButton,
                  isSelected && categoryStyles.selectedCategory,
                ]}
                onPress={() => handleCategorySelect(category.name)}
                activeOpacity={0.7}
              >
                <Image
                  source={filter.image}
                  style={[
                    categoryStyles.categoryImage,
                    isSelected && categoryStyles.selectedCategoryImage,
                  ]}
                  contentFit="cover"
                  transition={300}
                />
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


<View style={{backgroundColor: "#efefef"}}>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          margin: 8,
          padding: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <ScrollView 
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={onRefresh}
        //     tintColor={COLORS.primary}
            >
          {recommendation.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              {/* Row */}
              <View style={[{ flexDirection: "row", padding: 10 }]}>
                {/* at left */}
                <Image
                  source={item.image}
                  style={{ width: 100, height: 100 }}
                />
                <View style={{ flex: 1, justifyContent: "space-around" }}>
                  {/* at right as a column */}
                  <Text style={{ marginTop: 8, fontSize: 16 }}>
                    {item.name}
                  </Text>
                  <Text style={{ marginTop: 8, fontSize: 16 }}>
                    {item.merchant}
                  </Text>
                  <Text style={{ marginTop: 8, fontSize: 16 }}>
                    {item.price}
                  </Text>
                </View>
              </View>
              {recommendation.length - 1 && <View />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;
