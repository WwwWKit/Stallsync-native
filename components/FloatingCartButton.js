import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";
import { useColorScheme } from "../hooks/useColorScheme";

const FloatingCartButton = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const pathname = usePathname();

  // Show only on 3 tabs (e.g. /tabs/home, /tabs/discover, /tabs/favorites)
  // and merchant pages (/merchant/[id])
  const showOnTabs = ["/", "/merchant", "/category"];
  const isMerchantPage = pathname?.startsWith("/merchant");
  const isProductPage = pathname?.startsWith("/product");

  const isTabPage = showOnTabs.includes(pathname);
  if (!isTabPage && !isMerchantPage && !isProductPage) return null;

  return (
    <View style={[styles.buttonContainer, { bottom: isTabPage ? 120 : 30 }]}>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/cart")} // your cart route
        activeOpacity={0.8}
      >
        <Ionicons name="cart" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 120,
    right: 20,
    alignItems: "flex-end",
  },
  floatingButton: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C2A76D",
    borderRadius: 100,
    margin: 20,
    padding: 20,
  },
  badgeText: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 4,
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default FloatingCartButton;
