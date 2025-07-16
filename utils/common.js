import * as Linking from "expo-linking";
import { Alert, Platform } from "react-native";

export const getReturnUrl = () => {
  if (Platform.OS === "web") {
    return window.location.origin;
  } else {
    return Linking.createURL(""); // myapp://
  }
};

export const showAlert = (message) => {
  if (Platform.OS === "web") {
    alert(message); // browser-native alert
  } else {
    Alert.alert(message);
  }
};
