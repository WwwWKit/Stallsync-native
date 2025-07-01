import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const createCategoryStyles = (theme = "light") => {
  const color = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.primary,
    },
    categoryFilterContainer: {
      
      paddingVertical: 16,
      backgroundColor: color.background,
    },
    categoryFilterScrollContent: {
      paddingHorizontal: 16,
      gap: 12,
    },
    categoryButton: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color.card,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 60,
      borderWidth: 1,
      borderColor: color.border,
      minWidth: 120,
      minHeight: 120,
      shadowColor: color.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    selectedCategory: {
      backgroundColor: color.primary,
      borderColor: color.primary,
      shadowOpacity: 0.15,
    },
    categoryImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginBottom: 4,
      backgroundColor: color.border,
    },
    selectedCategoryImage: {
      borderWidth: 2,
      borderColor: color.white,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: "600",
      color: color.text,
      textAlign: "center",
    },
    selectedCategoryText: {
      color: color.white,
    },

    //Listing Style

    listContainer: {
      backgroundColor: color.listBackground,
      flex: 1
    },

    cardContainer: {
      flexDirection: "row", padding: 10, 
    },

    cardImage: {
       width: 100,
      height: 100,
      backgroundColor: color.primary,
      borderRadius: 10,
      marginRight:10,
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
    },

  });
};
