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

  const handleEditToggle = () => {
    if (!editable) {
      setEditable(true);
    } else {
      setShowModal(true);
    }
  };

  const confirmChanges = async () => {
    const payload = {
      psmbreml: email,
      psmbrnam: name,
      psmbrphn: phone,
      psmbrdob: birthday,
    };
    await memberAPI.updateMember(payload);

    const updated = {
      ...originalProfile,
      email,
      name,
      phone,
      birthday,
    };

    setOriginalProfile(updated);
    setEditable(false);
    setShowModal(false);
  };

  const discardChanges = () => {
    setEmail(originalProfile.email);
    setName(originalProfile.name);
    setPhone(originalProfile.phone);
    setBirthday(originalProfile.birthday);
    setEditable(false);
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
            <Text style={authStyles.label}>Email</Text>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter Email"
              value={email}
              editable={editable}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Name</Text>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter Name"
              value={name}
              editable={editable}
              onChangeText={setName}
              keyboardType="default"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Phone Number</Text>
            <View style={authStyles.phoneInput}>
              <TouchableOpacity style={authStyles.phonePrefix} disabled>
                <Text style={authStyles.prefixText}>{phonePre}</Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Phone Number"
                value={phone}
                editable={editable}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={{ flex: 1 }}
              />
            </View>
          </View>

          <DatePicker
            label="Birthday"
            value={birthday ? new Date(birthday) : null}
            onChange={(date) => setBirthday(date)}
            styles={authStyles}
            editable={editable}
          />
        </ScrollView>

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
