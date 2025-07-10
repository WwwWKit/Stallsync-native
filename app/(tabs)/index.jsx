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
import GoldHeaderBackground from "../../components/GoldHeaderBackground";
import SearchBar from "../../components/SearchBar";
import { useAuth } from "../../constants/AuthContext";
import { useColorScheme } from "../../hooks/useColorScheme";
import { merchantAPI, productAPI } from "../../services/backendAPIs";

const HomeScreen = () => {
  const { isLoadingAuth, isLoggedIn } = useAuth();
  const router = useRouter();
  const scheme = useColorScheme();
  const homeStyles = createHomeStyles(scheme);
  const latestStyles = createLatestStyles(scheme);
  const trendingStyles = createTrendingStyles(scheme);
  const recommendStyles = createRecommendStyles(scheme);

  const [allProducts, setAllProducts] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const [latest, setLatest] = useState([]);
  const [trending, setTrending] = useState([]);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState({
    products: [],
    merchants: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth) {
      fetchAllProducts();
      fetchPersonalized();
      fetchLatest();
      fetchTrending();
    }
  }, [isLoadingAuth]);

  const fetchAllProducts = async () => {
    const results = await productAPI.listProducts("");

    const enriched = results.map((p) => ({
      ...p,
      img: productAPI.fetchImage(p.psprdimg),
    }));

    setAllProducts(enriched);
  };

  const fetchProducts = async (searchQuery) => {
    const results = await productAPI.listProducts(searchQuery);

    const enriched = results.map((p) => ({
      ...p,
      img: productAPI.fetchImage(p.psprdimg),
    }));

    setProducts(enriched);
  };

  const fetchPersonalized = async () => {
    const res = await productAPI.listPersonalized();
    const enriched = res.map((p) => ({
      ...p,
      img: productAPI.fetchImage(p.psprdimg),
    }));
    setPersonalized(enriched);
  };

  const fetchLatest = async () => {
    const res = await productAPI.listLatest();
    const enriched = res.map((p) => ({
      ...p,
      img: productAPI.fetchImage(p.psprdimg),
    }));
    setLatest(enriched);
  };

  const fetchTrending = async () => {
    const res = await productAPI.listTrending();
    const enriched = res.map((p) => ({
      ...p,
      img: productAPI.fetchImage(p.psprdimg),
    }));
    console.log("Trending products:", enriched);
    setTrending(enriched);
  };

  const onSearch = () => {
    setShowDropdown(true);
  };

  const handleSearchTyping = async (text) => {
    setQuery(text);

    if (text.length > 0) {
      const [productResults, merchantResults] = await Promise.all([
        productAPI.listProducts(text),
        merchantAPI.listMerchants(text),
      ]);

      const enrichedProducts = productResults.map((p) => ({
        ...p,
        img: productAPI.fetchImage(p.psprdimg),
      }));

      const enrichedMerchants = merchantResults.map((m) => ({
        ...m,
        img: merchantAPI.fetchImage(m.psmrcsfi),
      }));

      setSuggestions({
        products: enrichedProducts,
        merchants: enrichedMerchants,
      });
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setSuggestions({ products: [], merchants: [] });
    }
  };

  return (
    <SafeAreaView style={homeStyles.container}>
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
            {suggestions.products.length > 0 && (
              <>
                <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
                  Products
                </Text>
                {suggestions.products.map((p) => (
                  <TouchableOpacity
                    key={`prod-${p.psprduid}`}
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

            {suggestions.merchants.length > 0 && (
              <>
                <Text
                  style={{ fontWeight: "bold", marginTop: 10, marginBottom: 6 }}
                >
                  Merchants
                </Text>
                {suggestions.merchants.map((m) => (
                  <TouchableOpacity
                    key={`mer-${m.psmrcuid}`}
                    style={{
                      flexDirection: "row",
                      marginBottom: 8,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      router.push(`/merchant/${m.psmrcuid}`);
                      setShowDropdown(false);
                      setQuery("");
                    }}
                  >
                    <Image
                      source={m.img ? { uri: m.img } : defaultImage}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        marginRight: 10,
                      }}
                    />
                    <View>
                      <Text>{m.psmrcnme}</Text>
                      <Text style={{ fontSize: 12, color: "#888" }}>
                        {m.psmrcdsc}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      )}

      <ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          onScrollBeginDrag={() => setShowDropdown(false)}
        >
          {latest.map((p) => (
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
                    source={p.img ? { uri: p.img } : defaultImage}
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
        {isLoggedIn && (
          <>
            <View style={homeStyles.sectionContainer}>
              <Text style={homeStyles.title}>Trending Dishes</Text>
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={trendingStyles.scrollContent}
                >
                  {trending.map((p) => {
                    return (
                      <TouchableOpacity
                        key={p.psprduid}
                        style={trendingStyles.cardContainer}
                        onPress={() => router.push(`/product/${p.id}`)}
                        activeOpacity={0.7}
                      >
                        <Image
                          source={p.img ? { uri: p.img } : defaultImage}
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
              {personalized.map((p) => (
                <TouchableOpacity
                  key={p.psprduid}
                  onPress={() => router.push(`/product/${p.psprduid}`)}
                >
                  {/* Row */}
                  <View style={recommendStyles.cardContainer}>
                    {/* at left */}
                    <Image
                      source={p.img ? { uri: p.img } : defaultImage}
                      style={recommendStyles.image}
                    />
                    <View style={recommendStyles.detailContainer}>
                      {/* at right as a column */}
                      <View>
                        <Text
                          style={recommendStyles.nameText}
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

                      <Text
                        style={recommendStyles.priceText}
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
          </>
        )}
        <View style={homeStyles.sectionContainer}>
          <Text style={homeStyles.title}>Other Menu</Text>
          {allProducts.map((p) => (
            <TouchableOpacity
              key={p.psprduid}
              onPress={() => router.push(`/product/${p.psprduid}`)}
            >
              {/* Row */}
              <View style={recommendStyles.cardContainer}>
                {/* at left */}
                <Image
                  source={p.img ? { uri: p.img } : defaultImage}
                  style={recommendStyles.image}
                />
                <View style={recommendStyles.detailContainer}>
                  {/* at right as a column */}
                  <View>
                    <Text
                      style={recommendStyles.nameText}
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

                  <Text
                    style={recommendStyles.priceText}
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
