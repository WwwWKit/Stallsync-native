import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");


export const createMerchantStyles = (theme = "light") => {
  const color = Colors[theme];

  return StyleSheet.create({
    container: {
          flex: 1,
          backgroundColor: color.background,
          paddingTop: StatusBar.currentHeight,
        }
  })}