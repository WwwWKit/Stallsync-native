import { Ionicons } from "@expo/vector-icons";
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
import {
  createHomeStyles,
  createLatestStyles,
  createRecommendStyles,
  createTrendingStyles,
} from "../../assets/styles/home.styles";
import GoldHeaderBackground from "../../components/ui/GoldHeaderBackground";
import SearchBar from "../../components/ui/SearchBar";
import { useAuth } from "../../context/AuthContext";
import { useColorScheme } from "../../hooks/useColorScheme";
import { merchantAPI, productAPI } from "../../services/backendAPIs";
// const SampleLatestData = [
//   { id: "1", name: "Classic Burger", image: BBQimg },
//   { id: "2", name: "Veggie Delight", image: BBQimg },
//   { id: "3", name: "Cheese Overload", image: BBQimg },
//   { id: "4", name: "Spicy Wings", image: BBQimg },
// ];

// const SampleTrendingData = [
//   { id: "1", name: "Classic Burger", image: BBQimg },
//   { id: "2", name: "Veggie Delight", image: BBQimg },
//   { id: "3", name: "Cheese Overload", image: BBQimg },
//   { id: "4", name: "Spicy Wings", image: BBQimg },
// ];

// const SampleRecommendationData = [
//   { id: "1", name: "Classic Burger", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { id: "2", name: "Veggie Delight", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { id: "3", name: "Cheese Overload", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { id: "4", name: "Spicy Wings", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { id: "5", name: "Classic Burger", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { id: "6", name: "Veggie Delight", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { id: "7", name: "Cheese Overload", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { id: "8", name: "Spicy Wings", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
// ];

const HomeScreen = () => {
  const { isLoadingAuth } = useAuth();
  const router = useRouter();
  const scheme = useColorScheme();
  const homeStyles = createHomeStyles(scheme);
  const latestStyles = createLatestStyles(scheme);
  const trendingStyles = createTrendingStyles(scheme);
  const recommendStyles = createRecommendStyles(scheme);
  
  // const [lData] = useState(SampleLatestData);
  // const [tData] = useState(SampleTrendingData);
  // const [rData] = useState(SampleRecommendationData);

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [latestProduct, setLatestProducts] = useState([]);

  useEffect(() => {
    if (!isLoadingAuth) {
      fetchMerchants(query);
      fetchProducts(query);
    }
  }, [isLoadingAuth, query]);

  const fetchMerchants = async (searchQuery) => {
    const results = await merchantAPI.listMerchants(searchQuery);
    setMerchants(results);
  };

const fetchProducts = async (searchQuery) => {
  const results = await productAPI.listProducts(searchQuery);

  const enriched = results.map((p) => ({
    ...p,
    img: productAPI.fetchImage(p.psprdimg),
  }));

  setProducts(enriched);
};

  //   const fetchLatestProducts = async () => {
  //   const results = await productAPI.listProducts(query);
  //   const threeMonthsAgo = new Date();
  //   threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  //   const filtered = results.filter((p) => new Date(p.psprdcrd) >= threeMonthsAgo);
  //   setLatestProducts(filtered.length ? filtered : getHighestRated(results));
  // };

  const onSearch = () => {
    fetchMerchants(query);
    fetchProducts(query);
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <GoldHeaderBackground />
      <SearchBar value={query} onChangeText={setQuery} onSearch={onSearch} />
      <ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {products.map((p) => (
            
            <View style={{ position: "relative" }}>
              <TouchableOpacity
                key={p.psprduid}
                onPress={() => router.push(`/product/${p.id}`)}
                style={latestStyles.cardContainer}
              >
                <View style={latestStyles.badge}>
                  <Text style={latestStyles.badgeText}>
                    <Ionicons name="star"></Ionicons> latest
                  </Text>
                </View>
                <View style={latestStyles.imageContainer}>
                  <Image
                      source={ p.img? { uri: p.img} : defaultImage}
                      style={latestStyles.image}
                      contentFit="cover"
                      transition={300}
                    />
          
                </View>
                <Text style={latestStyles.nameText}>{p.psprdnme}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={homeStyles.sectionContainer}>
          <Text style={homeStyles.title}>Trending Dishes</Text>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={trendingStyles.scrollContent}
            >
              {products.map((p) => {
                return (
                  <TouchableOpacity
                    key={p.psprduid}
                    style={trendingStyles.cardContainer}
                    onPress={() => router.push(`/product/${p.id}`)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={ p.img? { uri: p.img} : defaultImage}
                      style={[trendingStyles.image]}
                      contentFit="cover"
                      transition={300}
                    />
                    <Text
                      style={trendingStyles.nameText}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {p.psprdnme}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
        <View style={homeStyles.sectionContainer}>
          <View style={homeStyles.separator}></View>
        </View>

        <View style={homeStyles.sectionContainer}>
          <Text style={homeStyles.title}>Recommended For You</Text>
          {products.map((p) => (
            <TouchableOpacity
              key={p.psprduid}
              onPress={() => router.push(`/product/${p.psprduid}`)}
            >
              {/* Row */}
              <View style={recommendStyles.cardContainer}>
                {/* at left */}
                <Image source={ p.img? { uri: p.img} : defaultImage} style={recommendStyles.image} />
                <View style={recommendStyles.detailContainer}>
                  {/* at right as a column */}
                  <View>
                    <Text
                      style={recommendStyles.text}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {p.psprdnme}
                    </Text>
                    <Text
                      style={recommendStyles.merchantText}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {p.psmrcuiddsc}
                    </Text>
                  </View>

                  {console.log("psprdpri value:", p.psprdpri)}
                  <Text
                    style={recommendStyles.text}
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
    </SafeAreaView>
  );
};

export default HomeScreen;
