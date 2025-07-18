import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { createAuthStyles } from "../../assets/styles/auth.styles";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { userAPI } from "../../services/backendAPIs";
import { showAlert } from "../../utils/common";

const ForgetPassword = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const authStyles = createAuthStyles(scheme);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Reset Password",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, [navigation]);

  const handleReset = async () => {
    if (!email.trim()) {
      showAlert("Missing Email", "Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await userAPI.forgetPassword({ email });
      console.log("Reset link sent to:", res);
      if (res.result) {
  
        showAlert("Success, check your email for password reset instructions.");
        router.replace("/(auth)/sign-in");
      } else {
        showAlert(res.message || "Email not registered.");
      }
    } catch (error) {
      console.error("Reset error:", error);
      showAlert("Error, something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
      >
        <ScrollView contentContainerStyle={authStyles.scrollContent}>
          <Text style={authStyles.title}>Forgot Your Password?</Text>
          <Text style={authStyles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <TextInput
            style={authStyles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={theme.textPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={authStyles.authButton}
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.text} />
            ) : (
              <Text style={authStyles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgetPassword;
