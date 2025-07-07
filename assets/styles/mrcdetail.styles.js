import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const { width } = Dimensions.get("window");
const buttonWidth = width * 0.6;

export const createMrcDetailStyles = (theme = "light") => {
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
    ScrollContainer: {
      padding: 16,
    },
    image: {
      width: "100%",
      height: 250,
      borderRadius: 10,
    },
    name: {
      fontSize: 36,
      fontWeight: "bold",
      marginTop: 15,
    },
    ratingRow: {
      flexDirection: "row",
      marginBottom: 25,
      marginTop: 10,
    },
    rating: {
      fontSize: 18,
      fontWeight: "700",
      color: color.text,
      marginRight: 15,
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    label: {
      flex: 1,
      backgroundColor: color.tint,
      marginVertical: 5,
      marginRight: 20,
      paddingVertical: 6,
      borderRadius: 30,
      alignItems: "center",
    },
  });
};
