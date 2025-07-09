import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const { width, height } = Dimensions.get("window");

export const createOrderStyles = (theme = "light") => {
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
      padding: 16,
      borderRadius: 10,
    },
    card: {
      marginBottom: 15,
    },
    detailContainer: {
      flexDirection: "row",
      backgroundColor: color.background,
      marginVertical: 10,
      borderRadius: 10,
      padding: 10,
      justifyContent: "space-between",
      width: "100%",
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      width: "75%",
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginRight: 15,
    },
    nameContainer: {
      flex: 1, // take remaining space between image and status
      marginRight: 15,
    },
    name: {
      fontWeight: "600",
      fontSize: 18,
      flexShrink: 1,
      flexWrap: "wrap",
    },
    statusContainer: {
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginRight: 10,
      width: "25%",
    },
    status: {
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: color.primary,
      borderRadius: 20,
    },
    price: {
      fontSize: 22,
      fontWeight: "600",
    },

    merchantContainer: {
      padding: 16,
      backgroundColor: color.background,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      elevation: 5,
      shadowRadius: 3.84,
      paddingVertical: 30,
    },
    merchantText: {
      fontSize: 18,
      fontWeight: "600",
      color: color.text,
    },

    itemRows:{
        width: "100%",
      flexDirection: "row",
      marginBottom: 8,
      justifyContent: "space-between",
      alignItems: "center",
    },
    
    itemText: {
      fontSize: 20,
      fontWeight: "600",
      marginTop: 20,
    },
    remark: {
        fontSize: 16,
        color: color.textPlaceholder,
    }
  });
};
