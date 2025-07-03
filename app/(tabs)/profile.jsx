import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { createProfileStyles } from "../../assets/styles/profile.styles";
import GoldHeaderBackground from "../../components/GoldHeaderBackground";
import { useAuth } from "../../constants/AuthContext";
import { useColorScheme } from "../../hooks/useColorScheme";

const ProfileScreen = () => {
  const {signOut } = useAuth();
  const router = useRouter();
  const scheme = useColorScheme();
  const profileStyles = createProfileStyles(scheme);

  const handleSettingPress = (item) => {
    switch (item) {
      case "Term & Condition":
        router.push("/(tabs)/term");
        break;
      case "Profile Setting":
        router.push("/(tabs)/prfsetting");
      case "Privacy Setting":
        router.push("/(tabs)/prcsetting");
        break;
      case "Logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    await signOut("userToken");
    router.replace("/(auth)/sign-in");
  };

  const handleChangeImage = () => {
    // TODO: Open image picker or navigate to avatar update screen
    console.log("Change profile image");
  };

  return (
    <SafeAreaView style={profileStyles.container}>
      <GoldHeaderBackground />
      <TouchableOpacity
        style={profileStyles.imageContainer}
        onPress={handleChangeImage}
      >
        <Image
          style={profileStyles.image}
          source={require("../../assets/images/default.png")}
        ></Image>
      </TouchableOpacity>
      <Text style={profileStyles.nameText}>Username</Text>

      <View style={profileStyles.actionRow}>
        <TouchableOpacity
          style={profileStyles.actionButton}
          onPress={() => router.push("/(tabs)/history")}
        >
          <Text style={profileStyles.actionText}>Order History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={profileStyles.actionButton}
          onPress={() => router.push("/(tabs)/vouchers")}
        >
          <Text style={profileStyles.actionText}>My Vouchers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={profileStyles.settingItem}>
        {[
          "Profile Setting",
          "Privacy Setting",
          "Term & Condition",
          "Logout",
        ].map((item, i, arr) => (
          <TouchableOpacity
            key={i}
            style={profileStyles.settingList}
            onPress={() => handleSettingPress(item)}
          >
            <Text
              style={[
                profileStyles.settingText,
                item === "Logout" && profileStyles.logoutText,
              ]}
            >
              {item}
            </Text>
            {i < arr.length - 1 && <View style={profileStyles.separator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
