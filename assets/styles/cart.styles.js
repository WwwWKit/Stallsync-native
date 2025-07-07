import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const { width, height } = Dimensions.get("window");

export const createCartStyles = (theme = "light") => {
  const color = Colors[theme] || Colors["light"]; // fallback if theme not found

  return StyleSheet.create({
    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      backgroundColor: color.listBackground,
      paddingTop: StatusBar.currentHeight || 0,
    },
    scrollContainer: {
      margin: 8,
      padding: 16,
      borderRadius: 10,
    },
    card: {
      padding: 12,
      borderRadius: 10,
      marginBottom: 12,
      alignItems: "flex-start",
      backgroundColor: color.background,
    },
    index: {
      marginHorizontal: 8,
      fontWeight: "700",
      fontSize: 16,
    },
    contentContainer: {
      backgroundColor: color.background,
      borderTopWidth: 2,
      borderTopColor: color.primary,
      paddingVertical: 16,
    },
    image: {
      width: 80,
      height: 80,
      marginHorizontal: 16,
      borderRadius: 8,
    },

    name: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 5,
    },
    itemListContainer: {
      marginHorizontal: 16,
      marginVertical: 8,
    },
    item: {
      fontSize: 16,
    },
    andmore: {
      color: color.textPlaceholder,
      fontWeight: "700",
      fontSize: 14,
    },
    productImage: {
      width: 100,
      height: 100,
      marginRight: 16,
      borderRadius: 8,
    },

    rowContainer: {
      width: "100%",
      flexDirection: "row",
      marginBottom: 8,
      justifyContent: "space-between",
      alignItems: "center",
    },
    price: {
      fontSize: 18,
    },
    quantity: {
      fontSize: 16,
      color: color.textPlaceholder,
      marginTop: 8,
    },
    remark: {
      fontSize: 18,
      color: color.textPlaceholder,
    },

    separator: {
      height: 1,
      backgroundColor: color.separator,
      margin: 12
    },
    subtotal: {
      fontSize: 22,
      fontWeight: "600",
      alignSelf: "center",
    },
     total: {
       fontSize: 20,
      alignSelf: "flex-end",
      marginHorizontal: 16,

    },
    gtotal: {
       fontSize: 24,
       fontWeight: "600",
      alignSelf: "flex-end",
      marginHorizontal: 16,
      marginTop: 5,
    }
  });
};
