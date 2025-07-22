import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useLayoutEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { createCartStyles } from "../../../assets/styles/cart.styles";
import ToggleButton from "../../../components/ToggleButton";
import { Colors } from "../../../constants/colors";
import {
  cartAPI,
  orderAPI,
  productAPI,
  rewardAPI,
  transactionAPI,
} from "../../../services/backendAPIs";
import { getReturnUrl, showAlert } from "../../../utils/common";

const CartDetail = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const cartStyles = createCartStyles(theme);
  const { merchantid } = useLocalSearchParams();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [applyPoints, setApplyPoints] = useState("N");
  const [applyReward, setApplyReward] = useState("N");
  const [sst, setSst] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [pointDisc, setPointDisc] = useState(0);
  const [rewardDisc, setRewardDisc] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [rewardOptions, setRewardOptions] = useState([]);
  const [filteredRewardOptions, setFilteredRewardOptions] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Cart Items",
      headerShown: true,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 25 },
    });
  }, [navigation]);

  const calculate = () => {
    const subtotalVal = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.psitmsbt || 0),
      0
    );

    let pointDisc = applyPoints === "Y" ? userPoints / 100 : 0;
    if (pointDisc > subtotalVal) pointDisc = subtotalVal;

    let rewardDisc = 0;
    if (applyReward === "Y" && selectedReward) {
      const { psrwdtyp, psrwddva, psrwdcap } = selectedReward;
      const cap = parseFloat(psrwdcap) || 0;
      const value = parseFloat(psrwddva) || 0;

      if (psrwdtyp === "P") {
        rewardDisc = subtotalVal * value;
      } else if (psrwdtyp === "V") {
        rewardDisc = value;
      }

      if (cap > 0 && rewardDisc > cap) rewardDisc = cap;
      if (rewardDisc > subtotalVal - pointDisc)
        pointDisc = subtotalVal - rewardDisc;
    }

    const discountedSubtotal = subtotalVal - pointDisc - rewardDisc;
    const sstVal = discountedSubtotal * 0.06;
    const totalVal = discountedSubtotal + sstVal;

    setSubtotal(subtotalVal.toFixed(2));
    setPointDisc(pointDisc.toFixed(2));
    setRewardDisc(rewardDisc.toFixed(2));
    setSst(sstVal.toFixed(2));
    setTotal(totalVal.toFixed(2));
  };

  const [editableItems, setEditableItems] = useState({});

  const handleItemChange = (itemId, field, value) => {
    const updatedItem = {
      ...editableItems[itemId],
      [field]: value,
    };

    setEditableItems((prev) => ({
      ...prev,
      [itemId]: updatedItem,
    }));

    const item = cartItems.find((it) => it.psitmcno === itemId);
    if (item) {
      const newItem = {
        ...item,
        ...updatedItem,
      };
      handleUpdateItem(itemId, newItem);
    }
  };

  // const handleUpdateItem = async (itemId, item) => {
  //   const changes = editableItems[itemId];
  //   if (!changes) return;

  //   const payload = {
  //     psmbrcar: item.psmbrcar,
  //     psitmcno: itemId,
  //     psmrcuid: merchantid,
  //     psprduid: item.psprduid,
  //     psitmqty: changes.psitmqty || item.psitmqty,
  //     psitmrmk:
  //       changes.psitmrmk !== undefined ? changes.psitmrmk : item.psitmrmk,
  //   };

  //   try {
  //     await cartAPI.updateCartItem(payload); // assuming wrapper function
  //     fetchCartItem(); // refresh data
  //   } catch (err) {
  //     console.error("Update failed", err);
  //     showAlert("Update Failed", "Could not update the item.");
  //   }
  // };
  const handleUpdateItem = async (itemId, item) => {
    const payload = {
      psmbrcar: item.psmbrcar,
      psitmcno: itemId,
      psmrcuid: merchantid,
      psprduid: item.psprduid,
      psitmqty: item.psitmqty,
      psitmrmk: item.psitmrmk,
    };

    try {
      await cartAPI.updateCartItem(payload);
      fetchCartItem();
    } catch (err) {
      console.error("Update failed", err);
      showAlert("Update Failed", "Could not update the item.");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartAPI.deleteCartItem({ id: itemId }); // assuming wrapper function
      fetchCartItem(); // refresh data
    } catch (err) {
      console.error("Delete failed", err);
      showAlert("Remove Failed", "Could not remove the item.");
    }
  };

  const fetchCartItem = async () => {
    try {
      const res = await cartAPI.listCartItems(merchantid);
      const items = res.items;
      const enriched = await Promise.all(
        items.map(async (item) => ({
          ...item,
          image: productAPI.fetchImage(item.product.psprdimg),
        }))
      );
      setCartItems(enriched);
      setUserPoints(res.mbrPts);
    } catch (error) {
      console.log("Failed to fetch cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableReward = async () => {
    try {
      const rewards = await rewardAPI.rewardddl(merchantid);
      setRewardOptions(rewards);
    } catch (error) {
      console.log("Failed to fetch rewards:", error);
    }
  };

  useEffect(() => {
    if (merchantid) {
      fetchCartItem();
      fetchAvailableReward();
    }
  }, [merchantid]);

  useEffect(() => {
    console.log("Reward options updated:", rewardOptions);
  }, [rewardOptions]);

  useEffect(() => {
    if (cartItems.length > 0) {
      calculate();
    }
  }, [cartItems, applyPoints, applyReward, selectedReward]);

  useEffect(() => {
    const subtotalVal = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.psitmsbt),
      0
    );

    const eligibleRewards = rewardOptions.filter((reward) => {
      const minSpend = parseFloat(reward.psrwdmin || 0);
      return subtotalVal >= minSpend;
    });

    setFilteredRewardOptions(eligibleRewards);

    if (
      selectedReward &&
      !eligibleRewards.find((r) => r.psrwduid === selectedReward.psrwduid)
    ) {
      setSelectedReward(null);
    }
  }, [cartItems, rewardOptions]);

  const createOrder = async () => {
    const orderPayload = {
      psordrap: applyReward === "Y" && selectedReward ? "Y" : "N",
      psordpap: applyPoints,
      psrwduid: selectedReward?.psrwduid || "",
      psmrcuid: merchantid,
    };

    try {
      const orderRes = await orderAPI.createOrder(orderPayload);
      if (!orderRes || !orderRes.message?.ordId)
        throw new Error("Invalid order response");
      return { ordId: orderRes.message.ordId, amt: orderRes.message.amt };
    } catch (error) {
      console.error("Order creation failed:", error);
      showAlert("Order Creation Failed", "Please try again later.");
      return null;
    }
  };

  const handleOnlineCheckout = async () => {
    setLoading(true);
    try {
      const ordId = await createOrder();
      if (!ordId) throw new Error("Order creation failed");
      const trxRes = await transactionAPI.createOnline(ordId.ordId, ordId.amt, {
        returnUrl: getReturnUrl(),
      });
      if (!trxRes?.url) throw new Error("Transaction failed");

      Platform.OS === "web"
        ? (window.location.href = trxRes.url)
        : await WebBrowser.openAuthSessionAsync(
            trxRes.url,
            getReturnUrl() + "/checkout"
          );
    } catch (e) {
      console.error(e);
      showAlert("Checkout Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineCheckout = () => {
    router.replace({
      pathname: "/checkout/offline",
      params: { merchantid, total },
    });
  };

  if (loading)
    return (
      <SafeAreaView style={cartStyles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );

  if (!cartItems.length)
    return (
      <SafeAreaView style={cartStyles.loading}>
        <Text>No items from this merchant in your cart.</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={cartStyles.container}>
      <ScrollView
        contentContainerStyle={cartStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.map((item) => (
          <View key={item.psitmcno}>
            <View style={cartStyles.spacebetween}>
              <View style={cartStyles.flexstart}>
                <Image
                  source={{ uri: item.image }}
                  style={cartStyles.productImage}
                  resizeMode="cover"
                />
                <View>
                  <Text style={cartStyles.name}>{item.product.psprdnme}</Text>
                  <Text style={cartStyles.price}>RM {item.psitmunt}</Text>
                  <View style={cartStyles.qtyRow}>
                    <TouchableOpacity
                      onPress={() => {
                        const current = parseInt(
                          editableItems[item.psitmcno]?.psitmqty ||
                            item.psitmqty
                        );
                        if (current > 1) {
                          handleItemChange(
                            item.psitmcno,
                            "psitmqty",
                            String(current - 1)
                          );
                        }
                      }}
                    >
                      <Feather
                        name="minus-circle"
                        size={24}
                        color={theme.primary}
                      />
                    </TouchableOpacity>

                    <Text style={cartStyles.qtyText}>
                      {editableItems[item.psitmcno]?.psitmqty || item.psitmqty}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        const current = parseInt(
                          editableItems[item.psitmcno]?.psitmqty ||
                            item.psitmqty
                        );
                        handleItemChange(
                          item.psitmcno,
                          "psitmqty",
                          String(current + 1)
                        );
                      }}
                    >
                      <Feather
                        name="plus-circle"
                        size={24}
                        color={theme.primary}
                      />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={cartStyles.input}
                    placeholder="Remark"
                    value={
                      editableItems[item.psitmcno]?.psitmrmk ??
                      item.psitmrmk ??
                      ""
                    }
                    onChangeText={(text) =>
                      handleItemChange(item.psitmcno, "psitmrmk", text)
                    }
                  />
                </View>
              </View>
              <View style={{ justifyContent: "space-between" }}>
                <Text style={cartStyles.subtotal}>RM {item.psitmsbt}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  style={{ alignSelf: "flex-end" }}
                >
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={cartStyles.separator} />
          </View>
        ))}

        <TouchableOpacity
          onPress={() => router.replace(`/merchant/${merchantid}`)}
        >
          <Text style={cartStyles.addmore}>Add More</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={cartStyles.contentContainer}>
        <View style={cartStyles.rowContainer3}>
          <Text style={cartStyles.total}>
            Apply Points: (Available Points: {userPoints})
          </Text>
          <ToggleButton value={applyPoints} onChange={setApplyPoints} />
        </View>
        <View style={cartStyles.rowContainer3}>
          <Text style={cartStyles.total}>Apply Reward:</Text>
          <ToggleButton value={applyReward} onChange={setApplyReward} />
        </View>

        {applyReward === "Y" && (
          <View>
            {filteredRewardOptions.length === 0 ? (
              <Text style={cartStyles.loading}>No available rewards</Text>
            ) : (
              <ScrollView horizontal>
                {filteredRewardOptions.map((reward) => (
                  <TouchableOpacity
                    key={reward.psrwduid}
                    style={[
                      cartStyles.rewardButton,
                      {
                        backgroundColor:
                          selectedReward?.psrwduid === reward.psrwduid
                            ? theme.primary
                            : theme.greyBackground,
                      },
                    ]}
                    onPress={() => setSelectedReward(reward)}
                  >
                    <Text
                      style={{
                        color:
                          selectedReward?.psrwduid === reward.psrwduid
                            ? theme.white
                            : theme.text,
                      }}
                    >
                      {reward.psrwdnme}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </View>

      <View style={cartStyles.contentContainer}>
        <View style={cartStyles.rowContainer2}>
          <Text style={cartStyles.total}>Subtotal :</Text>
          <Text style={cartStyles.total}>RM {subtotal}</Text>
        </View>
        <View style={cartStyles.rowContainer2}>
          <Text style={cartStyles.total}>Points Disc :</Text>
          <Text style={cartStyles.total}>- RM {pointDisc}</Text>
        </View>
        <View style={cartStyles.rowContainer2}>
          <Text style={cartStyles.total}>Reward Disc :</Text>
          <Text style={cartStyles.total}>- RM {rewardDisc}</Text>
        </View>
        <View style={cartStyles.rowContainer2}>
          <Text style={cartStyles.total}>SST (6%) :</Text>
          <Text style={cartStyles.total}>RM {sst}</Text>
        </View>
        <View style={cartStyles.separator}></View>
        <View style={cartStyles.spacebetween}>
          <Text style={cartStyles.gtotal}>TOTAL :</Text>
          <Text style={cartStyles.gtotal}>RM {total}</Text>
        </View>
        <View style={{ height: 100 }} />
      </View>

      <View style={cartStyles.floatingButton}>
        <TouchableOpacity
          style={cartStyles.checkoutButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={cartStyles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={cartStyles.modal}
      >
        <View style={cartStyles.modalContent}>
          <Text style={cartStyles.modalTitle}>Choose Payment Method</Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              router.replace({
                pathname: "/checkout/offline",
                params: {
                  merchantid,
                  applyPoints,
                  applyReward,
                  psrwduid: selectedReward?.psrwduid || "",
                  total,
                },
              });
            }}
          >
            <Text style={cartStyles.modalText}>Pay at Counter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              handleOnlineCheckout();
            }}
          >
            <Text style={cartStyles.modalText}>Online Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={[cartStyles.modalText, cartStyles.modalCancel]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CartDetail;
