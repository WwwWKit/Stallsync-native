import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createProfileStyles } from "../../assets/styles/profile.styles";
import GoldHeaderBackground from "../../components/GoldHeaderBackground";
import { useAuth } from "../../constants/AuthContext";
import { useColorScheme } from "../../hooks/useColorScheme";
import { memberAPI } from "../../services/backendAPIs";

const ProfileScreen = () => {
  const { signOut, isLoadingAuth, isLoggedIn } = useAuth();
  const router = useRouter();
  const scheme = useColorScheme();
  const profileStyles = createProfileStyles(scheme);
  const [member, setMember] = useState({});

  const fetchMember = async () => {
    const member = await memberAPI.getMember();
    console.log("User data:", member);
    setMember(member);
  };

  useEffect(() => {
    if (!isLoadingAuth && isLoggedIn) {
      fetchMember();
    }
  }, [isLoadingAuth, isLoggedIn]);

  const handleSettingPress = (item) => {
    switch (item) {
      case "Term & Condition":
        router.push("/profile/term");
        break;
      case "Profile Setting":
        router.push("/profile/${member.psmbruid}");

      case "Privacy Setting":
        router.push("/profile/setting");
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

  const isGuest = !member?.psmbruid;

  return (
    <SafeAreaView style={profileStyles.container}>
      <GoldHeaderBackground />

      {isGuest ? (
        <>
          <View style={profileStyles.loading}>
            <Text style={profileStyles.nameText}>Guest User</Text>

            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
              <Text style={profileStyles.nameText}>
                <Text style={profileStyles.boldText}>Sign In </Text>
                 to view your profile.
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text>mid: {member.psmbruid}</Text>
          <TouchableOpacity
            style={profileStyles.imageContainer}
            onPress={handleChangeImage}
          >
            <Image
              style={profileStyles.image}
              source={require("../../assets/images/default.png")}
            ></Image>
          </TouchableOpacity>
          <View style={profileStyles.nameContainer}>
            <View style={profileStyles.typeContainer}>{member.psmbrtyp}</View>
            <Text style={profileStyles.nameText}>{member.psmbrnam}</Text>
          </View>
          <Text style={profileStyles.point}>points: {member.psmbrpts}</Text>
          <View style={profileStyles.actionRow}>
            <TouchableOpacity
              style={profileStyles.actionButton}
              onPress={() => router.push("/order")}
            >
              <Text style={profileStyles.actionText}>Order History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={profileStyles.actionButton}
              onPress={() => router.push("/reward")}
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
        </>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
