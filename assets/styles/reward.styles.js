import { StatusBar, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";



export const createRewardStyles = (theme = "light") => {
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
    card:{
      backgroundColor: color.tint,
      padding: 2,
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: color.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title:{
      fontSize: 22,
      fontWeight: "600",
      margin: 16,
      marginBottom: 6,
    },
    info:{
      backgroundColor: color.greyBackground,
      borderRadius: 10,
      padding: 16,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    off:{
      fontSize:30,
      fontWeight: "600"
    },
    cap:{},
    merchant:{},
    date:{
      fontWeight: "700"
    }
  })}