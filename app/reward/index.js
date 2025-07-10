import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { createProductStyles } from "../../assets/styles/prddetail.styles";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { rewardAPI } from "../../services/backendAPIs";

const RewardList = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const styles = createProductStyles(scheme);

  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Rewards or Vouchers",
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.text,
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 25,
      },
    });
  }, [navigation]);

  const fetchRewards = async () => {
    try {
      const res = await rewardAPI.listRewards();
      setRewards(res || []);
    } catch (error) {
      console.error("Failed to load rewards:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRewards();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!rewards || rewards.length === 0) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          No rewards available for redemption.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {rewards.map((reward) => (
          <TouchableOpacity
            key={reward.psrwduid}
            style={styles.itemContainer}
            onPress={() => router.push(`/reward/${reward.psrwduid}`)}
          >
            <View style={styles.textContainer}>
              <Text style={styles.title}>{reward.psrwdnme}</Text>
              <Text style={styles.description}>{reward.psrwddsc}</Text>
              <Text>Status: {reward.psrwdstsdsc}</Text>
              <Text>
                Points: {reward.psrwdtypdsc}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RewardList;
