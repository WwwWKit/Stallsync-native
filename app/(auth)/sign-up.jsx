import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createAuthStyles } from "../../assets/styles/auth.styles";
import DatePicker from "../../components/DatePicker";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { memberAPI, userAPI } from "../../services/backendAPIs";
import { showAlert } from "../../utils/common";

const SignUpScreen = () => {
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const authStyles = createAuthStyles(scheme);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phonePre, setPhonePre] = useState("+60");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [tempDob, setTempDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Reset when leaving the screen
        setDob(new Date());
      };
    }, [])
  );

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate;
      setTempDob(currentDate);

      if (Platform.OS === "android") {
        setDob(currentDate);
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIosDate = () => {
    setDob(tempDob);
    toggleDatePicker();
  };

  const handleSignUp = async () => {
    if (!username | !name | !email | !password | !phonePre | !phone | !dob) {
      showAlert("Please fill all fields");
      return;
    }

    // if (password.length < 8) {
    //   showAlert("Password must be at least 8 characters long");
    //   return;
    // }

    setLoading(true);

    try {
      // 1. Create User
      const userPayload = {
        psusrunm: username,
        psusrpwd: password,
        psusrnam: name,
        psusreml: email,
        psusrpre: "MY",
        psusrphn: phone,
        psusrrol: "MBR",
        psusrtyp: "MBR",
      };
      const userRes = await userAPI.createUser(userPayload);

      if (userRes.error) {
        showAlert("User creation failed.");
        return; // stop here if user creation fails
      }

      // 2. Create Member
      const memberPayload = {
        psmbrnam: name,
        psmbreml: email,
        psmbrphn: phone,
        psmbrpre: "MY",
        psusrnme: username,
        psmbrdob: dob,
      };
      const memberRes = await memberAPI.createMember(memberPayload);

      if (memberRes.error) {
        showAlert("Member creation failed.");
        return; // stop here if member creation fails
      }

      showAlert("Account created successfully!");
      router.back(); // Only called if both steps succeeded
    } catch (error) {
      console.error(error);
      showAlert("Failed to sign up. Please try again.");
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
              source={require("../../assets/images/BBQ.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>
          <Text style={authStyles.title}>Sign Up StallSync</Text>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Username</Text>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter Username"
              placeholderTextColor={scheme.primary}
              value={username}
              onChangeText={setUsername}
              keyboardType="default"
              autoCapitalize="none"
            ></TextInput>
          </View>
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Password</Text>
            <View style={[authStyles.textInput]}>
              <TextInput
                placeholder="Enter Password"
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
          </View>
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Email</Text>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            ></TextInput>
          </View>
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Name</Text>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyType="next"
            ></TextInput>
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Phone Number</Text>
            <View style={authStyles.phoneInput}>
              <TouchableOpacity
                style={authStyles.phonePrefix}
                onPress={() => {
                  // TODO: Implement phone prefix selection
                }}
              >
                <Text style={authStyles.prefixText}>{phonePre}</Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <DatePicker
            label="Birthday"
            value={dob}
            onChange={(date) => {
              setDob(date);
              setTempDob(date);
            }}
            styles={authStyles}
          />
          <TouchableOpacity
            style={[
              authStyles.authButton,
              loading && authStyles.buttonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={loading ? 0.8 : 1}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={() => router.back("")}
          >
            <Text style={authStyles.linkText}>
              Already have an account?
              <Text style={authStyles.link}> Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
