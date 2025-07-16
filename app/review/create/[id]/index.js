import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createOrderStyles } from "../../../../assets/styles/order.styles";
import { Colors } from "../../../../constants/colors";
import { showAlert } from "../../../../utils/common";
import { useColorScheme } from "../../../../hooks/useColorScheme";
import { reviewAPI, uploadAPI } from "../../../../services/backendAPIs";

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
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [videoFilename, setVideoFilename] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Write a Review",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
    });
  }, [navigation]);

  const uploadDocument = async (file) => {
    const actualFile = file.originFileObj || file;

    const formData = new FormData();
    formData.append("document", {
      uri: actualFile.uri,
      type: actualFile.type || "application/octet-stream",
      name: actualFile.name || actualFile.uri.split("/").pop(),
    });

    try {
      const response = await uploadAPI.upload(formData);
      return response?.document?.sysfnm;
    } catch (error) {
      console.error("Upload error", error);
      return "";
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled) {
      const selected = result.assets[0];
      setImage(selected);
      const filename = await uploadDocument(selected);
      setImageFilename(filename);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.canceled) {
      const selected = result.assets[0];
      setVideo(selected);
      const filename = await uploadDocument(selected);
      setVideoFilename(filename);
    }
  };

  const renderStars = () =>
    [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => setRating(star)} style={{ marginHorizontal: 4 }}>
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
      psrvwimg: imageFilename,
      psrvwvid: videoFilename,
    };

    setLoading(true);
    try {
      console.log(payload);
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
        <Text style={[styles.title, { marginBottom: 20 }]}>Rate your order</Text>
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
          {renderStars()}
        </View>

        <TextInput
          placeholder="Write your review here..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 120, textAlignVertical: "top" }]}
        />

        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontWeight: "600", marginBottom: 10 }}>Attachments (optional)</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={pickImage} style={{ padding: 10, backgroundColor: theme.card, borderRadius: 10 }}>
              <Ionicons name="image" size={24} color={theme.text} />
              <Text>Select Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickVideo} style={{ padding: 10, backgroundColor: theme.card, borderRadius: 10 }}>
              <Ionicons name="videocam" size={24} color={theme.text} />
              <Text>Select Video</Text>
            </TouchableOpacity>
          </View>

          {image && <Image source={{ uri: image.uri }} style={{ width: "100%", height: 200, borderRadius: 10, marginTop: 16 }} />}
          {video && (
            <Video
              source={{ uri: video.uri }}
              style={{ width: "100%", height: 200, borderRadius: 10, marginTop: 16 }}
              useNativeControls
              resizeMode="contain"
            />
          )}
        </View>

        <TouchableOpacity
          style={{
            width: "90%",
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
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "600" }}>
              Submit Review
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default createReview;
