import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const FloatingCartButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Show only on 3 tabs (e.g. /tabs/home, /tabs/discover, /tabs/favorites)
  // and merchant pages (/merchant/[id])
  const showOnTabs = ["/", "/merchant", "/category"];
  const isMerchantPage = pathname?.startsWith("/merchant");
  const isProductPage = pathname?.startsWith("/product");

  if (!showOnTabs.includes(pathname) && !isMerchantPage && !isProductPage) return null;

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={() => router.push("/cart")} // your cart route
      activeOpacity={0.8}
    >
      <Ionicons name="cart" size={24} color="white" />
      <Text style={styles.badgeText}>3</Text> {/* Optional badge */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    right: 35,
    bottom: 120, // slightly above bottom tab bar
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ff9800",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    zIndex: 999,
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
