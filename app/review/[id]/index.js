import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { createOrderStyles } from "../../../assets/styles/order.styles";
import { Colors } from "../../../constants/colors";
import { useColorScheme } from "../../../hooks/useColorScheme";
import { reviewAPI } from "../../../services/backendAPIs";


// Dummy fetch function – Replace this with your real API call
const fetchReviewById = async (id) => {
  const res = await reviewAPI.getReview(id); // adjust to your real API shape
  return res.message; // or res.data depending on your API structure
};

const ReviewPage = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const styles = createOrderStyles(scheme);

  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Review",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
    });
  }, [navigation]);

  useEffect(() => {
    const loadReview = async () => {
      if (typeof id === "string") {
        const data = await fetchReviewById(id);
        setReview(data);
      }
      setLoading(false);
    };
    loadReview();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : review ? (
          <View>
           <View>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: theme.text }}>
              Reviewer: {review.crtuser}
            </Text>
            <Text style={{ fontSize: 16, color: theme.text }}>
              Rating: {review.psrvwrtg} / 5
            </Text>
            <Text style={{ fontSize: 14, color: theme.text, marginTop: 8 }}>
              {review.psrvwdsc}
            </Text>
            <Text style={{ fontSize: 12, color: theme.gray, marginTop: 8 }}>
              Date: {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </View>
          </View>
        ) : (
          <Text style={{ color: theme.text }}>Review not found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewPage;
