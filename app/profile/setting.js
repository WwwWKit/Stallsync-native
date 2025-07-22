import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createProfileStyles } from "../../assets/styles/profile.styles";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function PrivacySetting() {
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const profileStyles = createProfileStyles(scheme);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Privacy Settings",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
    });
  }, [navigation]);

  const handleSettingPress = (item) => {
    switch (item) {
      case "Reset Password":
        router.push("/profile/resetPassword");
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={profileStyles.container}>
      <ScrollView style={profileStyles.settingItem}>
        {["Reset Password"].map((item, i, arr) => (
          <TouchableOpacity
            key={i}
            style={profileStyles.settingList}
            onPress={() => handleSettingPress(item)}
          >
            <Text style={profileStyles.settingText}>{item}</Text>
            {i < arr.length  && <View style={profileStyles.separator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
