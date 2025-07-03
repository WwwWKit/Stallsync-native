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
    View
} from "react-native";
import defaultImage from "../../../assets/images/default.png";
import { createCategoryStyles } from "../../../assets/styles/category.styles";
import { useColorScheme } from "../../../hooks/useColorScheme";
import { merchantAPI } from "../../../services/backendAPIs";

export default MerchantPage = () => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [ merchant, setMerchant ] = useState("");
    const [loading, setLoading] = useState(true);
    const scheme = useColorScheme();
      const categoryStyles = createCategoryStyles(scheme);
        const [selectedFilter, setSelectedFilter] = useState("");
         const [typeFilters, setTypeFilters] = useState([]);

    useLayoutEffect(() => {
    navigation.setOptions({
      title: "Merchant Details",
      headerShown: true,
      headerStyle: {
        backgroundColor: "#6200ee",
      },
      headerTintColor: "#ffffff", // 🎨 Back button & title color
      headerTitleStyle: {
        fontWeight: "bold", // Optional styling
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (id) {
      fetchMerchant();
      fetchFilter();
      handleFilterSelected("ALL");
    }
  }, [id]);

  const fetchMerchant = async () => {
      try {
        const res = await merchantAPI.getMerchant(id);
        const enriched = {
            ...res,
            img: merchantAPI.fetchImage(res.osmrcsfi),
        };
        setMerchant(enriched);
      }catch (error) {
        console.log("Failed to load merchant:", error);
      }finally {
        setLoading(false);
      }
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const fetchFilter = async () => {
      try {
        const { types } = await productAPI.getFilter(false, true);
  
        const formattedTypes = types.map((typ, idx) => ({
          id: idx,
          name: typ.desc,
          code: typ.code,
        }));
  
        setTypeFilters(formattedTypes);
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };

  if (!merchant) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Merchant not found</Text>
      </SafeAreaView>
    );
  }


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
    <SafeAreaView style={{ flex: 1, padding: 16 }}>

      <ScrollView>

        <Image source={merchant.img ? { uri: merchant.img } : defaultImage}
                  style={{ width: "100%", height: 250, borderRadius: 10 }}
                  resizeMode="cover" />

        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>{merchant.psmrcnme}</Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>{merchant.psmrcdsc}</Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>{merchant.psmrcrtg}</Text>










        <View style={categoryStyles.categoryFilterContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={categoryStyles.categoryFilterScrollContent}
                >

        
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




      </ScrollView>

    </SafeAreaView>
  )
  
}