import { useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

const ToggleButton = ({ value, onChange }) => {
  const offset = useRef(new Animated.Value(value === "Y" ? 1 : 0)).current;

  const toggle = () => {
    const newValue = value === "Y" ? "N" : "Y";
    Animated.timing(offset, {
      toValue: newValue === "Y" ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onChange(newValue);
  };

  const thumbLeft = offset.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const bgColor = offset.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ccc", "#34C759"], 
  });

  return (
    <TouchableOpacity onPress={toggle}>
      <Animated.View style={[styles.switchContainer, { backgroundColor: bgColor }]}>
        <Animated.View style={[styles.thumb, { left: thumbLeft }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 55,
    height: 34,
    borderRadius: 30,
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: "#fff",
    position: "absolute",
  },
});


export default ToggleButton;