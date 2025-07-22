import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createOrderStyles } from "../../../assets/styles/order.styles";
import { Colors } from "../../../constants/colors";
import { useColorScheme } from "../../../hooks/useColorScheme";
import { reviewAPI } from "../../../services/backendAPIs";

const ReviewPage = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const styles = createOrderStyles(scheme);

  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [desc, setDesc] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

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
      try {
        if (typeof id === "string") {
          const res = await reviewAPI.getReview(id);
          const data = res.message;
          setReview(data);
          setRating(Number(data.psrvwrtg));
          setDesc(data.psrvwdsc);
          setUpdatedAt(data.updatedAt);
        }
      } catch (err) {
        console.error("Error loading review:", err);
        Alert.alert("Error", "Failed to load review.");
      } finally {
        setLoading(false);
      }
    };

    loadReview();
  }, [id]);

  const handleSave = async () => {
    if (!rating || isNaN(rating)) {
      Alert.alert("Invalid", "Rating must be a number");
      return;
    }

    try {
      const payload = {
        psorduid: id,
        psrvwrtg: parseFloat(rating),
        psrvwdsc: desc,
        updatedAt,
        psrvwimg: review.psrvwimg || "",
        psrvwvid: review.psrvwvid || "",
      };

      await reviewAPI.updateReview(payload);
      Alert.alert("Success", "Review updated successfully.");
    } catch (err) {
      console.error("Error updating review:", err);
      Alert.alert("Error", "Failed to update review.");
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : review ? (
          <View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: theme.text }}
            >
              Reviewer: {review.crtuser}
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text, marginTop: 16 }}>
              Rating:
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 20 }}>
          {renderStars()}
        </View>

            <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text, marginTop: 16 }}>
              Description:
            </Text>
            <TextInput
              multiline
              style={{
                borderColor: theme.border,
                borderWidth: 1,
                padding: 8,
                height: 100,
                marginTop: 4,
                color: theme.text,
                textAlignVertical: "top",
              }}
              value={desc}
              onChangeText={setDesc}
            />

            <Text style={{ fontSize: 12, color: theme.gray, marginTop: 8 }}>
              Last updated:{" "}
              {updatedAt
                ? new Date(updatedAt).toLocaleString()
                : "N/A"}
            </Text>

            <TouchableOpacity
              onPress={handleSave}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.primary,
                borderRadius: 100,
                margin: 20,
                padding: 20,
              }}
            >
              <Text
                style={{
                  color: theme.text,
                  fontSize: 20,
                  fontWeight: "600",
                }}
              >
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{ color: theme.text }}>Review not found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewPage;
