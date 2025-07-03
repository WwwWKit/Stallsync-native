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
import GoldHeaderBackground from "../../components/GoldHeaderBackground";
import SearchBar from "../../components/SearchBar";
import { useAuth } from "../../constants/AuthContext";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { merchantAPI } from "../../services/backendAPIs";

const MerchantScreen = () => {
  const router = useRouter();
  const { isLoadingAuth } = useAuth();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const merchantStyles = createMerchantStyles(scheme);

  const [merchants, setMerchants] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isLoadingAuth) {
      fetchMerchants(query);
    }
  }, [isLoadingAuth, query]);

  const fetchMerchants = async (searchQuery) => {
    let results = await merchantAPI.listMerchants(searchQuery);
    const enriched = results.map((m) => ({
      ...m,
      img: merchantAPI.fetchImage(m.psmrcsfi),
    }));
    setMerchants(enriched);
  };

  const onSearch = () => {
    fetchMerchants(query);
  };

  return (
    <SafeAreaView style={merchantStyles.container}>
      <GoldHeaderBackground />
      <SearchBar value={query} onChangeText={setQuery} onSearch={onSearch} />

      <ScrollView>
        {merchants.map((m) => (
          <TouchableOpacity
            key={m.psmrcuid}
            onPress={() => router.push(`/merchant/${m.psmrcuid}`)}
          >
            <View
              style={{
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
              }}
            >
              <Image
                source={m.img ? { uri: m.img } : BBQimg}
                style={{ width: 100, height: 100 }}
              />
              <View
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}
              >
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  {m.psmrcnme}
                </Text>
                <Text
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  style={{ fontSize: 16, textAlign: "justify" }}
                >
                  {typeof m.psmrcdsc === "string"
                    ? m.psmrcdsc
                    : "No description available."}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MerchantScreen;
