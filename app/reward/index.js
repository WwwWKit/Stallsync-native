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
import { createRewardStyles } from "../../assets/styles/reward.styles";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { rewardAPI } from "../../services/backendAPIs";

const RewardList = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const styles = createRewardStyles(scheme);

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
          <TouchableOpacity key={reward.psrwduid} style={styles.card}>
            <Text style={styles.title}>{reward.psrwdnme}</Text>

            <View style={styles.info}>
              <Text>
                {reward.psrwdmin > 0
                  ? `Minimum spend RM${parseInt(reward.psrwdmin)}`
                  : "No minimum spend"}
              </Text>

              {reward.psrwdtyp === "P" ? (
                <Text style={styles.off}>
                  {parseInt(reward.psrwddva * 100)}% off
                </Text>
              ) : reward.psrwdtyp === "V" ? (
                <Text style={styles.off}>
                  RM{parseFloat(reward.psrwddva).toFixed(2)} off
                </Text>
              ) : null}

              {reward.psrwdcap > 0 && (
                <Text>Cap at RM{parseFloat(reward.psrwdcap).toFixed(2)}</Text>
              )}
              <Text>{reward.psrwddsc}</Text>
              <Text> </Text>
              {Array.isArray(reward.psmrcnames) &&
                reward.psmrcnames.length > 0 && (
                  <Text>Available at: {reward.psmrcnames.join(", ")}</Text>
                )}

              {reward.psrwdfdt && reward.psrwdtdt && (
                <Text>
                  Valid from
                  <Text style={styles.date}>
                    {" "}
                    {new Date(reward.psrwdfdt).toLocaleDateString()}
                  </Text>
                  <Text> to</Text>
                  <Text style={styles.date}>
                    {" "}
                    {new Date(reward.psrwdtdt).toLocaleDateString()}
                  </Text>
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RewardList;
