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
      padding: 10,
      backgroundColor: color.background,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: color.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "hidden",
      borderRadius: 10,
    },
    index: {
      marginHorizontal: 8,
      fontWeight: "700",
      fontSize: 16,
      color: color.text,
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
      color: color.text,
    },

    subName: {
      color: color.text,
    },
    itemListContainer: {
      marginHorizontal: 16,
      marginVertical: 8,
    },
    item: {
      fontSize: 16,
      color: color.text,
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
    flex:{ flex: 1},
    flexstart: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    spacebetween: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rowContainer2: {
      width: "100%",
      flexDirection: "row",
      paddingHorizontal: 16,
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowContainer3: {
      width: "100%",
      flexDirection: "row",
      marginBottom: 4,
      paddingHorizontal: 16,
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
    addmore: {
      color: color.primary,
      fontWeight: "600",
      fontSize: 16,
      textAlign: "center",
    },

    separator: {
      height: 1,
      backgroundColor: color.separator,
      margin: 12,
    },
    subtotal: {
      fontSize: 22,
      fontWeight: "600",
      alignSelf: "center",
    },
    total: {
      fontSize: 20,
      alignSelf: "flex-end",
    },
    gtotal: {
      fontSize: 24,
      fontWeight: "600",
      alignSelf: "flex-end",
      marginHorizontal: 16,
      marginTop: 5,
    },

    applyButton: {
      backgroundColor: color.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
    },
    applyText: {
      color: color.text,
      fontSize: 18,
      fontWeight: "600",
    },
    rewardButton: {
      padding: 10,
      borderRadius: 8,
      marginLeft: 16,
    },
    floatingButton: {
      position: "absolute",
      bottom: 10,
      width: "100%",
      alignItems: "center",
    },
    checkoutButton: {
      width: "95%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color.primary,
      borderRadius: 100,
      margin: 20,
      padding: 20,
    },
    checkoutText: { color: theme.text, fontSize: 20, fontWeight: "600" },

    modal: { justifyContent: "flex-end", margin: 0 },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 20,
    },
    modalText: {
      fontSize: 16,
      paddingVertical: 12,
    },
    modalCancel: { color: "red" },

    emptyString: {
      textAlign: "center",
      fontSize: 16,
      color: theme.text,
    },
  });
};
