import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const { width, height } = Dimensions.get("window");

export const createOrderStyles = (theme = "light") => {
    const color = Colors[theme] || Colors["light"]; // fallback if theme not found

    return StyleSheet.create({
        loading: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        container: {
            flex: 1,
            backgroundColor: color.listBackground,
            paddingTop: StatusBar.currentHeight || 0,
        },
        scrollContainer: {
            padding: 16,
            borderRadius: 10,
        },
        card: {
            marginBottom: 15
        },
        detailContainer: {
            flexDirection: "row",
            backgroundColor: color.background,
            marginVertical: 10,
            borderRadius: 10,
            padding: 10,
            justifyContent: "space-between",
            width: "100%"
        },
        rowContainer: {
            flexDirection: "row",
            alignItems: "flex-start",
            width: "75%"
        },
        image: {
            width: 100,
            height: 100,
            borderRadius: 8,
            marginRight: 15
        },
        nameContainer: {
            flex: 1, // take remaining space between image and status
            marginRight: 15
        },
        name: {
            fontWeight: "600",
            fontSize: 18,
            flexShrink: 1,
            flexWrap: "wrap",
        },
        statusContainer: {
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginRight: 10,
            width: "25%"
            
        },
        status: {
            fontSize: 16,
            paddingVertical: 10,
            paddingHorizontal:20,
            backgroundColor: color.primary,
            borderRadius: 20
        },
        price: {
            fontSize:22,
            fontWeight: "600"
        }
    })
}