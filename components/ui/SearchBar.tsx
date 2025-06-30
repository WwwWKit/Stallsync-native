import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import { useColorScheme } from "../../hooks/useColorScheme";

type SearchBarProps = TextInputProps & {
  onSearch?: () => void;
  onChangeText?: (text: string) => void;
  value?: string;
};
export default function SearchBar({
  onSearch,
  value,
  onChangeText,
  ...props
}: SearchBarProps) {
  const scheme = useColorScheme();
  const theme = Colors[scheme];
  const [inputValue, setInputValue] = useState(value || "");

  const handleChangeText = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };
  const handleClear = () => {
    setInputValue("");
    onChangeText?.("");
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Search by name..."
          placeholderTextColor={theme.textPlaceholder}
          style={styles.input}
          underlineColorAndroid="transparent" // Android focus border
          value={inputValue}
          onChangeText={handleChangeText}
          {...props}
        />
        {inputValue.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close" size={20} color="#888" style={styles.icon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onSearch}>
          <Ionicons name="search" size={20} color="#888" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 16,
    padding: 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginVertical: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 0, // remove iOS border
  },
  icon: {
    marginLeft: 8,
  },
});
