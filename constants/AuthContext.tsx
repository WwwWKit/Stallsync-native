import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import { setAuthToken } from "../constants/APIs";
import { userAPI } from "../services/backendAPIs";

type AuthContextType = {
  userToken: string | null;
  isLoggedIn: boolean;
  isLoadingAuth: boolean;
  isAuthChecking: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoggedIn: false,
  isLoadingAuth: true,
  isAuthChecking: false,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);


 useEffect(() => {
  const loadToken = async () => {
    try {
      let token: string | null = null;
      if (Platform.OS === "web") {
        token = localStorage.getItem("userToken");
      } else {
        token = await SecureStore.getItemAsync("userToken");
      }

      if (token) {
        setAuthToken(token);
        // ✅ Call your backend to verify
        const res = await userAPI.verifyAuth(token);

        if (res.ok) {
          setUserToken(token);
          setIsLoggedIn(true);
        } else {
          // Token invalid — clean up
          setAuthToken(null);
          if (Platform.OS === "web") {
            localStorage.removeItem("userToken");
          } else {
            await SecureStore.deleteItemAsync("userToken");
          }
          setUserToken(null);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      console.error("Error loading token:", e);
      setIsLoggedIn(false);
    } finally {
      setIsLoadingAuth(false);
      setIsAuthChecking(false); // ✅ Done checking
    }
  };

  loadToken();
}, []);


  const signIn = async (token: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem("userToken", token);
    } else {
      await SecureStore.setItemAsync("userToken", token);
    }

    setUserToken(token);
    setAuthToken(token); //  Sync to memory for Axios
    setIsLoggedIn(true);

    console.log("Token stored for future use:", token);
  };

  const signOut = async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem("userToken");
    } else {
      await SecureStore.deleteItemAsync("userToken");
    }
    setAuthToken(null);
    setUserToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ userToken, isLoggedIn, isLoadingAuth, isAuthChecking, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
