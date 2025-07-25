import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

let currentToken= null ;

export const setAuthToken = (token) => {
  currentToken = token;
};

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  //baseURL: "http://192.168.56.1:5040/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "api-key": "c871651f-bdf3-4795-b826-cc3cfb80075a",
  },
});

api.interceptors.request.use(async (config) => {
  let token = currentToken;
  if (!token){
    if (Platform.OS === "web") {
    token = localStorage.getItem("userToken"); // web-safe
  } else {
    token = await SecureStore.getItemAsync("userToken"); // native-safe
  }
  }

  if (token) {
    config.headers.Authorization = token;
    console.log("Token added:", config.headers.Authorization);
  } else {
    console.log("No token found");
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Possibly call signOut or navigate to login
    }
    return Promise.reject(error);
  }
);

export default api;
