import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const { height } = Dimensions.get("window");

export const createAuthStyles = (theme = "light") => {
  const color = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
      paddingTop: StatusBar.currentHeight,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 40,
    },
    imageContainer: {
      height: height * 0.3,
      marginBottom: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 320,
      height: 320,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: color.text,
      textAlign: "center",
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 16,
      color: color.text,
      textAlign: "center",
      marginBottom: 10,
    },
    label: {
      marginBottom: 10,
      color: color.text,
      fontWeight: "bold",
    },
    guestText: {
      color: color.icon,
      textAlign: "center",
    },

    formContainer: {
      flex: 1,
    },
    inputContainer: {
      marginTop: 20,
      position: "relative",
    },
    textInput: {
      fontSize: 16,
      color: color.text,
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: color.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: color.border,
    },
    phonePrefix: {
      position: "absolute",
      left: 16,
      top: 14,
    },
    prefixText: {
      fontSize: 16,
      color: color.text,
    },
    phoneInput: {
      fontSize: 16,
      color: color.text,
      paddingVertical: 16,
      paddingHorizontal: 60,
      backgroundColor: color.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: color.border,
    },
    dobButton: {
      fontSize: 16,
      color: color.text,
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: color.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: color.border,
    },
    dobp: {
      color: "4f4f4f",
    },
    dobTextContainer: {
      position: "absolute",
      left: 16,
      top: 14,
    },
    webDatePicker: {
      padding: 16,
      fontSize: 16,
      borderRadius: 12,
      backgroundColor: color.background,
      borderColor: color.border,
      borderWidth: 1,
      color: color.text,
    },
    datePicker: {
      height: 10,
      margin: 20,
      marginTop: -10,
      marginBottom: 0,
    },
    iosDatePicker: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    pickerButton: {
      paddingHorizontal: 35,
      height: 50,
      justifyContent: "center",
      borderRadius: 50,
      marginTop: 10,
      marginBottom: 20,
      backgroundColor: color.primary,
    },
    cancelButton: {
      paddingHorizontal: 35,
      height: 50,
      justifyContent: "center",
      borderRadius: 50,
      marginTop: 10,
      marginBottom: 20,
      backgroundColor: "#11182711",
    },
    dobText: {
      color: color.text,
      fontSize: 16,
    },
    buttonText: {
      color: color.textLight,
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
    cancelText: {
      color: color.primary,
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
    eyeButton: {
      position: "absolute",
      right: 16,
      top: 10,
      padding: 4,
    },
    forgot: {
      color: "blue",
      alignSelf: "flex-end",
      marginTop: 10,
    },
    authButton: {
      backgroundColor: color.primary,
      paddingVertical: 18,
      borderRadius: 12,
      marginTop: 20,
      marginBottom: 30,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    linkContainer: {
      alignItems: "center",
      paddingBottom: 20,
      fontSize: 16,
      color: color.textLight,
    },
    linkText: {
      fontSize: 16,
      color: color.text,
      fontWeight: "600",
    },
    link: {
      color: color.primary,
      fontWeight: "600",
    },
    emptyContainer: {
      flex: 1,
    },
    separator: {
      height: 1,
      backgroundColor: color.separator,
      margin: 12,
    },
    scrollContainer: {
      padding: 16,
    },
    editButton: {
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color.primary,
      borderRadius: 100,
      margin: 20,
      padding: 20,
    },
    editButtonText: {
      color: color.text,
      fontSize: 20,
      fontWeight: "600",
    },
    modalContainer: {
      position: "absolute",
      bottom: 10,
      width: "100%",
      alignItems: "center",
    },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    dialog: {
      backgroundColor: color.white,
      padding: 24,
      borderRadius: 12,
      width: "80%",
      alignItems: "center",
    },
    dialogText: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
    },
    dialogText2: {
      marginBottom: 20,
      textAlign: "center",
    },
    buttonRow: {
      flexDirection: "row",
      gap: 12,
    },
    discardButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      backgroundColor: color.greyBackground,
    },
    confirmButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      backgroundColor: color.primary,
    },
    confirmText: { color: color.text },

    resetButton: {
      backgroundColor: color.primary,
      paddingVertical: 18,
      borderRadius: 12,
      marginTop: 20,
      marginBottom: 30,
    },

    errorBorder: { borderColor: "red", borderWidth: 1 },
    errorText: { color: "red", marginTop: 4 },
  });
};
