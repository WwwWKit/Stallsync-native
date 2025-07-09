import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const { width } = Dimensions.get("window");
const buttonWidth = width * 0.6;

export const createProductStyles = (theme = "light") => {
  const color = Colors[theme];

  return StyleSheet.create({
    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      backgroundColor: color.background,
      paddingTop: StatusBar.currentHeight,
    },
    scrollContainer: {
      padding: 16,
    },
    image: {
      width: "100%",
      height: 250,
      borderRadius: 10,
    },
    detailContainer: {
      padding: 10,
    },
    name: {
      fontSize: 36,
      fontWeight: "bold",
      marginTop: 15,
      color: color.text
    },
    merchant: {
      fontSize: 18,
      color: color.textPlaceholder,
      marginBottom: 25,
    },
    label: {
      flex: 1,
      backgroundColor: color.tint,
      color: color.text,

      marginVertical: 5,
      marginRight: 20,
      paddingVertical: 6,
      borderRadius: 30,
      alignItems: "center",
    },
    description: {
      fontSize: 20,
      color: color.text,
      marginBottom: 25,
      textAlign: "justify",
    },
    price: {
      fontSize: 28,
      fontWeight: "600",
      marginBottom: 20,
      color: color.text
    },
    remark: {
      fontSize: 16,
      paddingVertical: 32,
      paddingHorizontal: 20,
      borderRadius: 12,
      borderWidth: 1,
      color: color.text,
      borderWidth: 1,
      borderColor: color.text,
      padding: 8,
    },

    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    qtyButton: {
      width: 40,
      height: 40,
      backgroundColor: color.primary,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 15,
    },
    btnSign: {
      fontSize: 20,
      fontWeight: "600",
    },
    quantity: {
      fontSize: 25,
      marginRight: 15,
    },
    addButtonContainer: {
      position: "absolute",
      bottom: 30,
      width: "85%",
      alignItems: "flex-start",
    },
    addToCart: {
      width: "80%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color.primary,
      borderRadius: 100,
      margin: 20,
      padding: 20,
    },
    addButtonText: {
      color: color.text,
      fontSize: 20,
      fontWeight: "600",
    },
  });
};
