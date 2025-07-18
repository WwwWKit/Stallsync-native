import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
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
import DatePicker from "../../components/DatePicker";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { memberAPI } from "../../services/backendAPIs";
import { showAlert } from "../../utils/common";

const ProfileSetting = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const authStyles = createAuthStyles(scheme);

  const [editable, setEditable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phonePre, setPhonePre] = useState("+60");
  const [birthday, setBirthday] = useState("");

  const [errors, setErrors] = useState({});
  const [originalProfile, setOriginalProfile] = useState({
    email: "",
    name: "",
    phone: "",
    birthday: "",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Profile Settings",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
    });
  }, [navigation]);

  const fetchData = async () => {
    const res = await memberAPI.getMember();
    if (res) {
      const profile = {
        email: res.psmbreml || "",
        name: res.psmbrnam || "",
        phone: res.psmbrphn || "",
        birthday: res.psmbrdob || "",
      };
      setOriginalProfile(profile);
      setEmail(profile.email);
      setName(profile.name);
      setPhone(profile.phone);
      setBirthday(profile.birthday);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateProfile = () => {
    const newErrors = {};
    const today = new Date();

    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";

    if (!name) newErrors.name = "Name is required";

    if (!phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{9,10}$/.test(phone)) newErrors.phone = "Phone must be 9 or 10 digits";

    if (!birthday) newErrors.birthday = "Date of birth is required";
    else if (new Date(birthday).getTime() > today.getTime()) {
      newErrors.birthday = "Cannot be future date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = () => {
    if (!editable) {
      setEditable(true);
    } else {
      const isValid = validateProfile();
      if (isValid) {
        setShowModal(true);
      }
    }
  };

  const confirmChanges = async () => {
    const payload = {
      psmbreml: email,
      psmbrnam: name,
      psmbrphn: phone,
      psmbrdob: birthday,
    };
    try {
      await memberAPI.updateMember(payload);
      showAlert("Success, profile updated successfully.");
      router.replace("/profile");
    } catch (err) {
      console.error("Update error:", err);
      showAlert("Error, failed to update profile. Please try again.");
    } finally {
      setEditable(false);
      setShowModal(false);
    }
  };

  const discardChanges = () => {
    setEmail(originalProfile.email);
    setName(originalProfile.name);
    setPhone(originalProfile.phone);
    setBirthday(originalProfile.birthday);
    setEditable(false);
    setShowModal(false);
    setErrors({});
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
          {/* Email */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Email</Text>
            <TextInput
              style={[
                authStyles.textInput,
                editable && errors.email && authStyles.errorBorder,
              ]}
              placeholder="Enter Email"
              value={email}
              editable={editable}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
            {editable && errors.email && (
              <Text style={authStyles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Name */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Name</Text>
            <TextInput
              style={[
                authStyles.textInput,
                editable && errors.name && authStyles.errorBorder,
              ]}
              placeholder="Enter Name"
              value={name}
              editable={editable}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              keyboardType="default"
              autoCapitalize="words"
              returnKeyType="next"
            />
            {editable && errors.name && (
              <Text style={authStyles.errorText}>{errors.name}</Text>
            )}
          </View>

          {/* Phone */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Phone Number</Text>
            <View
              style={[
                authStyles.phoneInput,
                editable && errors.phone && authStyles.errorBorder,
              ]}
            >
              <TouchableOpacity style={authStyles.phonePrefix} disabled>
                <Text style={authStyles.prefixText}>{phonePre}</Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Phone Number"
                value={phone}
                editable={editable}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                }}
                keyboardType="phone-pad"
                style={{ flex: 1 }}
              />
            </View>
            {editable && errors.phone && (
              <Text style={authStyles.errorText}>{errors.phone}</Text>
            )}
          </View>

          {/* Birthday */}
          <DatePicker
            label="Birthday"
            value={birthday ? new Date(birthday) : null}
            onChange={(date) => {
              const iso = date.toISOString();
              setBirthday(iso);
              if (errors.birthday) setErrors((prev) => ({ ...prev, birthday: null }));
            }}
            styles={authStyles}
            editable={editable}
            error={editable ? errors.birthday : null}
          />
          {editable && errors.birthday && (
            <Text style={authStyles.errorText}>{errors.birthday}</Text>
          )}
        </ScrollView>

        {/* Edit / Submit Button */}
        <View style={authStyles.modalContainer}>
          <TouchableOpacity
            style={authStyles.editButton}
            onPress={handleEditToggle}
          >
            <Text style={authStyles.editButtonText}>
              {editable ? "Submit" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Confirmation Modal */}
      <Modal visible={showModal} transparent animationType="none">
        <View style={authStyles.modalBackground}>
          <View style={authStyles.dialog}>
            <Text style={authStyles.dialogText}>Confirm Changes?</Text>
            <Text style={authStyles.dialogText2}>
              Do you want to save these changes to your profile?
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

export default ProfileSetting;
