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
    View
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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Reset Password",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
    });
  }, [navigation]);

  const validatationCheck = async () => {
    if (oldPassword === "") {
      showAlert("Please enter old password.");
      return;
    }

    if (newPassword === "") {
      showAlert("Please enter new password.");
      return;   
    }

    if (confirmPassword === "") {
      showAlert("Please confirm new password.");
      return;
    }


    setShowModal(true);
  }

  const confirmChanges = async () => {
    

    const res = await userAPI.changePassword(oldPassword, newPassword, confirmPassword);
    setShowModal(false);

    if (res?.error) {
      showAlert(res.message || "Failed to change password.");
    } else {
      showAlert("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.back(); 
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
          <View>
            <Text style={authStyles.label}>Old Password</Text>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter old password"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>New Password</Text>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Confirm New Password</Text>
            <TextInput
              style={authStyles.textInput}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={authStyles.editButton}
          onPress={validatationCheck}
        >
          <Text style={authStyles.editButtonText}>Reset Password</Text>
        </TouchableOpacity>
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
