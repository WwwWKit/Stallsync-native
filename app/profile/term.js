import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";

const TermPage = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const styles = createStyles(theme);

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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Introduction</Text>
          <Text style={styles.text}>
            Welcome to StallSync: Ordering System. By accessing or using our
            mobile application and related services, you agree to comply with
            and be bound by the following Terms and Conditions. Please read them
            carefully before using the system.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Acceptance of Terms</Text>
          <Text style={styles.text}>
            Welcome to StallSync: Ordering System. By accessing or using our
            mobile application and related services, you agree to comply with
            and be bound by the following Terms and Conditions. Please read them
            carefully before using the system.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Service Overview</Text>
          <Text style={styles.text}>
            StallSync provides a digital platform that allows users to:
          </Text>
          <Text style={styles.text}>
            - Browse and order food from participating food stalls.
          </Text>
          <Text style={styles.text}>
            - Receive personalized menu recommendations based on past orders and
            preferences.
          </Text>
          <Text style={styles.text}>
            - Track real-time order status and updates.
          </Text>
          <Text style={styles.text}>
            - Review past transactions and manage user profiles.
          </Text>
          <Text style={styles.text}>
            StallSync serves as a facilitator between customers and merchants,
            and does not directly prepare or deliver food.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>User Responsibilities</Text>
          <Text style={styles.text}>
            Account Integrity: Users must provide accurate and complete
            information during registration and maintain the confidentiality of
            their login credentials.
          </Text>
          <Text style={styles.text}>
            Order Accuracy: Users are responsible for ensuring that their orders
            are correct before submission.
          </Text>
          <Text style={styles.text}>
            Respectful Conduct: Users must not engage in any activity that
            interferes with the operation of StallSync or violates the rights of
            others, including food stall operators.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Payments and Refunds</Text>
          <Text style={styles.text}>
            - All payments must be made through the supported in-app payment
            gateways or as specified by the merchant.
          </Text>
          <Text style={styles.text}>
            - StallSync is not liable for any issues related to the quality or
            delivery of food. Disputes regarding food items must be resolved
            directly with the merchant.
          </Text>
          <Text style={styles.text}>
            - Refunds, where applicable, are subject to the refund policy of the
            individual food stall.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Data Usage and Privacy</Text>
          <Text style={styles.text}>
            By using the app, you consent to the collection, storage, and use of
            your personal data as outlined in our Privacy Policy. This includes
            data such as your name, contact details, ordering history, and
            location (if provided for service enhancement).
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Intellectual Property</Text>
          <Text style={styles.text}>
            All content, logos, design elements, and software related to
            StallSync are the property of the StallSync development team or its
            licensors and are protected by copyright laws. Unauthorized use,
            reproduction, or distribution is strictly prohibited.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Modifications to the Terms</Text>
          <Text style={styles.text}>
            StallSync reserves the right to update or modify these Terms and
            Conditions at any time. Continued use of the application after
            changes have been made constitutes acceptance of those changes.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Limitation of Liability</Text>
          <Text style={styles.text}>
            StallSync shall not be held liable for any indirect, incidental, or
            consequential damages resulting from the use or inability to use the
            system, including but not limited to delays, service interruptions,
            or data loss.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Termination</Text>
          <Text style={styles.text}>
            We reserve the right to suspend or terminate access to StallSync for
            users who violate these Terms and Conditions or misuse the system in
            any way.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Governing Law</Text>
          <Text style={styles.text}>
            These Terms and Conditions are governed by and construed in
            accordance with the laws of [insert your jurisdiction], without
            regard to its conflict of law principles.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      padding: 16,
    },
    textContainer: {
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.text,
      textAlign: "justify",
    },
  });

export default TermPage;
