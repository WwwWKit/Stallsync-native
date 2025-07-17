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
  const [errors, setErrors] = useState({});

  useFocusEffect(
    useCallback(() => {
      return () => {
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
        setDob(currentDate.toISOString());
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  const validateForm = async () => {
    const newErrors = {};
    const today = new Date();

    if (!username) newErrors.username = "Username is required";
    else {
      try {
        const checkRes = await userAPI.getUserByUsername(username);
        if (checkRes && checkRes.exist === true) newErrors.username = "Username already registered";
      } catch {
        newErrors.username = "Error checking username";
      }
    }

    if (!name) newErrors.name = "Name is required";

    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{9,10}$/.test(phone)) newErrors.phone = "Phone must be 9 or 10 digits";

    if (!dob) newErrors.dob = "Date of birth is required";
    else if (new Date(dob).getTime() > today.getTime()) newErrors.dob = "Cannot be future date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!(await validateForm())) return;

    setLoading(true);
    let createdUsername = null;

    try {
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

      if (userRes?.error) throw new Error("User creation failed");
      createdUsername = username;

      const memberPayload = {
        psmbrnam: name,
        psmbreml: email,
        psmbrphn: phone,
        psmbrpre: "MY",
        psusrnme: username,
        psmbrdob: dob,
      };

      const memberRes = await memberAPI.createMember(memberPayload);
      if (memberRes?.error) {
        await userAPI.deleteUser(createdUsername);
        throw new Error("Member creation failed. Rolling back user.");
      }

      showAlert("Account created successfully!");
      router.back();
    } catch (error) {
      console.error(error);
      showAlert(error.message || "Failed to sign up. Please try again.");
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
              style={[
                authStyles.textInput,
                errors.username && authStyles.errorBorder,
              ]}
              placeholder="Enter Username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username)
                  setErrors((prev) => ({ ...prev, username: null }));
              }}
            />
            {errors.username && <Text style={authStyles.errorText}>{errors.username}</Text>}
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Password</Text>
            <View style={[authStyles.textInput, errors.password && authStyles.errorBorder]}>
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
            {errors.password && <Text style={authStyles.errorText}>{errors.password}</Text>}
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Email</Text>
            <TextInput
              style={[
                authStyles.textInput,
                errors.email && authStyles.errorBorder,
              ]}
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
            {errors.email && <Text style={authStyles.errorText}>{errors.email}</Text>}
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Name</Text>
            <TextInput
              style={[
                authStyles.textInput,
                errors.name && authStyles.errorBorder,
              ]}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyType="next"
            />
            {errors.name && <Text style={authStyles.errorText}>{errors.name}</Text>}
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Phone Number</Text>
            <View
              style={[
                authStyles.phoneInput,
                errors.phone && authStyles.errorBorder,
              ]}
            >
              <TouchableOpacity style={authStyles.phonePrefix} onPress={() => {}}>
                <Text style={authStyles.prefixText}>{phonePre}</Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && <Text style={authStyles.errorText}>{errors.phone}</Text>}
          </View>

          <DatePicker
            label="Birthday"
            value={dob}
            onChange={(date) => {
              setDob(date.toISOString());
              setTempDob(date);
            }}
            styles={authStyles}
            error={errors.dob}
          />

          {errors.dob && <Text style={authStyles.errorText}>{errors.dob}</Text>}

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
