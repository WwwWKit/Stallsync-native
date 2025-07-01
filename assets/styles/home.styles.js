import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const cardWidth = width * 0.92;
const cardHeight = height * 0.25;
const trendIingtemWidth = width / 2.5;

export const createLatestStyles = (theme = "light") => {
  const color = Colors[theme];

  return StyleSheet.create({
    cardContainer: {
      alignItems: "center",
      marginRight: 20,
    },
    badge: {
      position: "absolute",
      top: 10,
      left: 10,
      zIndex: 1,
      width: 100,
      backgroundColor: color.badge,
      justifyContent: "center",
      borderRadius: 10,
    },
    badgeText: {
      color: color.primary,
      fontWeight: "600",
      fontSIze: 20,
      paddingLeft: 15,
      marginVertical: 5,
    },
    imageContainer: {
      width: 450,
      height: 240,
      backgroundColor: color.card,
      borderRadius: 16,
      shadowColor: color.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      overflow: "hidden",
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      backgroundColor: color.border,
    },
    nameText: {
      marginTop: 6,
      fontSize: 16,
      color: color.text,
      fontWeight: "600",
    },
  });
};

export const createTrendingStyles = (theme = "light") => {
  const color = Colors[theme];

  return StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 4,
      //gap: 0,
    },
    cardContainer: {
      marginHorizontal: 8,
      flexDirection: "column",
      backgroundColor: color.card,
      paddingHorizontal: 4,
    },
    image: {
      width: trendIingtemWidth,
      height: trendIingtemWidth,
      maxHeight: 200,
      maxWidth: 200,
      borderRadius: 10,
      marginBottom: 4,
      backgroundColor: color.border,
      alignSelf: "center",
    },
    nameText: {
      fontSize: 16,
      color: color.text,
      textAlign: "left",
    },
  });
};

export const createRecommendStyles = (theme = "light") => {
  const color = Colors[theme];

  return StyleSheet.create({
    cardContainer: {
      width: cardWidth,
      height: 100,
      flexDirection: "row",
      marginVertical: 10,
      marginLeft: 10,
    },
    image: {
      width: 100,
      height: 100,
      backgroundColor: color.primary,
      borderRadius: 10,
      marginHorizontal: 10,
    },
    detailContainer: {
      flex: 1,
      paddingVertical: 4,
      justifyContent: "space-between",
    },
    nameText: {
      fontSize: 16,
      color: color.text,
      fontWeight: "600",
      textAlign: "left",
    },
    merchantText: {
      fontSize: 14,
      color: color.text,
      textAlign: "left",
      marginTop: 2,
      color: color.textPlaceholder,
    },

    priceText:{
      fontSize: 15,
      color: color.text,
      fontWeight: "500",
      textAlign: "left",
    }
  });
};

export const createHomeStyles = (theme = "light") => {
  const color = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    sectionContainer: {
      backgroundColor: color.background,
    },
    title: {
      fontWeight: "600",
      fontSize: 24,
      paddingHorizontal: 10,
      color: color.text,
      margin: 10,
    },
    separator: {
      height: 0.2,
      backgroundColor: color.placeholder,
      marginHorizontal: 10,
      marginVertical: 16,
    },
  });
};
