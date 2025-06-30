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
import BBQimg from "../../assets/images/BBQ.png";
import { createMerchantStyles } from "../../assets/styles/merchant.styles";
import GoldHeaderBackground from "../../components/ui/GoldHeaderBackground";
import SearchBar from "../../components/ui/SearchBar";
import { Colors } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useColorScheme } from "../../hooks/useColorScheme";
import { merchantAPI } from "../../services/backendAPIs";

// const SampleMerchantData = [
//   { psmrcuid: "1", name: "Classic Burger", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { psmrcuid: "2", name: "Veggie Delight", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { psmrcuid: "3", name: "Cheese Overload", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { psmrcuid: "4", name: "Spicy Wings", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { psmrcuid: "5", name: "Classic Burger", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { psmrcuid: "6", name: "Veggie Delight", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { psmrcuid: "7", name: "Cheese Overload", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
//   { psmrcuid: "8", name: "Spicy Wings", image: BBQimg, price: "RM10.00", merchant: "Masakan Malaysia" },
// ];

const MerchantScreen = () => {
  const router = useRouter();
  const { isLoadingAuth } = useAuth();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const merchantStyles = createMerchantStyles(scheme);
  // const [sampleMerchant] = useState(SampleMerchantData);

  const [merchants, setMerchants] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isLoadingAuth) {
      fetchMerchants(query);
    }
  }, [isLoadingAuth, query]);

  const fetchMerchants = async (searchQuery) => {
    const results = await merchantAPI.listMerchants(searchQuery);
    setMerchants(results);
  };

  const onSearch = () => {
    fetchMerchants(query);
  };

  return (
    <SafeAreaView style={merchantStyles.container}>
      <GoldHeaderBackground />
      <SearchBar value={query} onChangeText={setQuery} onSearch={onSearch} />
      <ScrollView>
        {merchants.map(
          (
            m //sampleMerchant.map if using the sample data
          ) => (
            <TouchableOpacity
              key={m.psmrcuid}
              onPress={() => router.push(`/merchant/${m.psmrcuid}`)}
            >
              {/* Row */}
              <View
                style={[
                  {
                    flexDirection: "row",
                    padding: 10,
                    backgroundColor: theme.background,
                    borderRadius: 10,
                    marginVertical: 5,
                    marginHorizontal: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    overflow: "hidden",
                  },
                ]}
              >
                {/* at left */}
                <Image source={BBQimg} style={{ width: 100, height: 100 }} />
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                  }}
                >
                  {/* at right as a column */}
                  <Text style={{ fontWeight: "600", fontSize: 16 }}>
                    {m.psmrcnme}
                  </Text>
                  <Text
                    numberOfLines={3}
                    ellipsizeMode="tail" // truncate the text
                    style={{ fontSize: 16, textAlign: "justify" }}
                  >
                    {m.psmrcdsc || "No description"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MerchantScreen;
