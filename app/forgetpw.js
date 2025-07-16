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
      const res = await userAPI.resetPassword({ email });
      if (res.success) {
        showAlert("Success", "Check your email for password reset instructions.");
        router.replace("/auth/login");
      } else {
        showAlert("Failed", res.message || "Unable to process request.");
      }
    } catch (error) {
      console.error("Reset error:", error);
      showAlert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={authStyles.scrollContainer}>
          <Text style={authStyles.title}>Forgot Your Password?</Text>
          <Text style={authStyles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <TextInput
            style={authStyles.input}
            placeholder="Enter your email"
            placeholderTextColor={theme.textPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={authStyles.button}
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
