import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";

const TermPage = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Terms & Conditions",
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.text,
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
      },
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
        }}
      >
        <View>
          <Text>This is setting page</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermPage;
