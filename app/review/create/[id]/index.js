import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createOrderStyles } from "../../../../assets/styles/order.styles";
import { Colors } from "../../../../constants/colors";
import { useColorScheme } from "../../../../hooks/useColorScheme";
import { reviewAPI } from "../../../../services/backendAPIs";
import { showAlert } from "../../../../utils/common";

const createReview = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const styles = createOrderStyles(scheme);

  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Write a Review",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
    });
  }, [navigation]);

  const renderStars = () =>
    [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => setRating(star)}
        style={{ marginHorizontal: 8 }}
      >
        <Ionicons
          name={rating >= star ? "star" : "star-outline"}
          size={32}
          color={rating >= star ? "#FFD700" : theme.textPlaceholder}
        />
      </TouchableOpacity>
    ));

  const handleSubmit = async () => {
    if (rating < 1 || description.trim() === "") {
      showAlert("Please select a rating and write a review.");
      return;
    }

    const payload = {
      psorduid: id,
      psrvwrtg: rating,
      psrvwdsc: description.trim(),
    };

    setLoading(true);
    try {
      const res = await reviewAPI.createReview(payload);

      if (res?.result === "success") {
        showAlert("Review submitted successfully!");
        router.back();
      } else {
        showAlert("Review creation was not successful");
      }
    } catch (e) {
      console.error("Review submission failed:", e);
      showAlert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: theme.text,
            marginTop: 16,
          }}
        >
          Rate your order:
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 20,
          }}
        >
          {renderStars()}
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: theme.text,
            marginTop: 16,
          }}
        >
          Description:
        </Text>
        <TextInput
          placeholder="Write your review here..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          style={{
            borderColor: theme.border,
            borderWidth: 1,
            padding: 8,
            height: 100,
            marginTop: 4,
            color: theme.text,
            textAlignVertical: "top",
          }}
        />

        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.primary,
            borderRadius: 100,
            margin: 20,
            padding: 20,
          }}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{ color: theme.text, fontSize: 20, fontWeight: "600" }}
            >
              Submit Review
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default createReview;
