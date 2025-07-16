import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { createAuthStyles } from "../../assets/styles/auth.styles";
import api from "../../constants/APIs";
import { useAuth } from "../../constants/AuthContext";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { showAlert } from "../../utils/common";
const SignInScreen = () => {
  const { signIn } = useAuth();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const authStyles = createAuthStyles(scheme);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!username || !password) {
      showAlert("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/psusrprf/login", {
        username,
        password,
      });
      console.log("Login response:", response.data);

  
      const token = response.data.message?.token;
      await signIn(token);
      console.log("Extracted token:", token);
    

      if (!token) {
        showAlert("Invalid username or password");
        return;
      }
    
      router.replace("/");
    } catch (error) {
      console.log("Login error:", error);
      showAlert(
        "Login error",
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/BURGER.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>StallSync</Text>
          <Text style={authStyles.subtitle}>Intelligent Ordering System</Text>

          <View style={[authStyles.formContainer]}>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
            
            <View style={[authStyles.inputContainer, authStyles.textInput]}>
              <TextInput
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={theme.textLight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
            onPress= { router.push("/forgetpw")}
            >
              <Text style={authStyles.forgot}>FORGOT PASSWORD?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.replace("/")}>
            <Text style={authStyles.guestText}>login in as guest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              authStyles.authButton,
              loading && authStyles.buttonDisabled,
            ]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={loading ? 0.8 : 1}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text style={authStyles.linkText}>
              Don&apos;t have an account?
              <Text style={authStyles.link}> Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
