import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const { height } = Dimensions.get("window");
export const createProfileStyles = (theme = "light") => {
  const color = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
      paddingTop: StatusBar.currentHeight,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 40,
    },
    imageContainer: {
      height: height * 0.1,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: height * 0.28 -100,
      alignSelf: "center",
      
    },
    image: {
      width: 180,
      height: 180,
      borderRadius: 200,
    },
    typeContainer: {
      backgroundColor: color.primary,
      fontSize: 20,
      color: color.text,
      padding: 5,
      borderRadius: 5,
      marginRight: 10,
    },
    nameContainer: {
      flexDirection: "row",
      marginTop: height * 0.28,
      justifyContent: "center",
    },
    nameText: {
      fontSize: 28,
      color: color.text,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 30,
      marginHorizontal: 15,
    },
    actionButton: {
      flex: 1,
      backgroundColor: color.primary,
      paddingVertical: 30,
      borderRadius: 10,
      marginHorizontal: 6,
      alignItems: "center",
    },
    actionText: {
      color: "white",
      fontWeighFt: "400",
      fontSize: 20,
    },
    settingList: {
      backgroundColor: color.background,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    settingItem: {
      paddingVertical: 14,
    },
    settingText: {
    fontSize: 16,
  },logoutText: {
    color: "red",
    fontWeight: "600",
  },
    separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 14,
  }
  });
};
