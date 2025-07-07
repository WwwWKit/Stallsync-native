import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
const { height } = Dimensions.get("window");
export default function GoldHeaderBackground() {
  return <View style={styles.headerBackground} />;
}

const styles = StyleSheet.create({
  headerBackground: {
    position: 'absolute',
    top: -150,
    left: -100,
    right: -100,
    height: height * 0.4,
    borderBottomLeftRadius: 300,
    borderBottomRightRadius: 300,
    backgroundColor: '#C2A76D',
    zIndex: -1,
  },
});