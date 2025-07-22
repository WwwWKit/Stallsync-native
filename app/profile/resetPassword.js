import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createAuthStyles } from "../../assets/styles/auth.styles";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { userAPI } from "../../services/backendAPIs";
import { showAlert } from "../../utils/common";

const ResetPassword = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const authStyles = createAuthStyles(scheme);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [errors, setErrors] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Reset Password",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
    });
  }, [navigation]);

  const handleValidation = () => {
    const newErrors = {};

    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Please enter old password.";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "Please enter new password.";
    } else if (newPassword.length < 6 || newPassword.length > 20) {
      newErrors.newPassword = "Password must be 6 to 20 characters.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm new password.";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowModal(true);
    }
  };

  const confirmChanges = async () => {
    const newErrors = {};

    const res = await userAPI.changePassword(
      oldPassword,
      newPassword,
      confirmPassword
    );
    setShowModal(false);

    if (res?.error) {
      showAlert("Old password is incorrect.");
      newErrors.oldPassword = "Please enter correct old password.";
      setErrors(newErrors);
    } else {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.replace("/profile");
    }
  };

  const discardChanges = () => {
    setShowModal(false);
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
      >
        <ScrollView
          style={authStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Old Password</Text>
            <TextInput
              style={[
                authStyles.textInput,
                errors.oldPassword && authStyles.errorBorder,
              ]}
              placeholder="Enter old password"
              value={oldPassword}
              onChangeText={(text) => {
                setOldPassword(text);
                if (errors.oldPassword) {
                  setErrors((prev) => ({ ...prev, oldPassword: null }));
                }
              }}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.oldPassword && (
              <Text style={authStyles.errorText}>{errors.oldPassword}</Text>
            )}
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>New Password</Text>
            <TextInput
              style={[
                authStyles.textInput,
                errors.newPassword && authStyles.errorBorder,
              ]}
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (errors.newPassword) {
                  setErrors((prev) => ({ ...prev, newPassword: null }));
                }
              }}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.newPassword && (
              <Text style={authStyles.errorText}>{errors.newPassword}</Text>
            )}
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Confirm New Password</Text>
            <TextInput
              style={[
                authStyles.textInput,
                errors.confirmPassword && authStyles.errorBorder,
              ]}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }
              }}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.confirmPassword && (
              <Text style={authStyles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>
          <TouchableOpacity
            style={authStyles.editButton}
            onPress={handleValidation}
          >
            <Text style={authStyles.editButtonText}>Reset Password</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showModal} transparent animationType="none">
        <View style={authStyles.modalBackground}>
          <View style={authStyles.dialog}>
            <Text style={authStyles.dialogText}>Confirm Changes?</Text>
            <Text style={authStyles.dialogText2}>
              Do you want to change your password?
            </Text>
            <View style={authStyles.buttonRow}>
              <TouchableOpacity
                onPress={discardChanges}
                style={authStyles.discardButton}
              >
                <Text>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmChanges}
                style={authStyles.confirmButton}
              >
                <Text style={authStyles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ResetPassword;
