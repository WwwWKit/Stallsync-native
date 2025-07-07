import { Platform } from "react-native";
import * as Linking from "expo-linking";

export const getReturnUrl = () => {
  if (Platform.OS === "web") {
    return window.location.origin;
  } else {
    return Linking.createURL(""); // myapp://
  }
};