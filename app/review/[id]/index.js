import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView
} from "react-native";
import { createOrderStyles } from "../../../assets/styles/order.styles";
import { Colors } from "../../../constants/colors";
import { useColorScheme } from "../../../hooks/useColorScheme";

const ReviewPage = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const styles = createOrderStyles(scheme);

  const [loading, setLoading] = useState(false);
 
  const [description, setDescription] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Review",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
    });
  }, [navigation]);

 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewPage;
