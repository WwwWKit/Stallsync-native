import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DateFormatter } from "../utils/dateFormatter"; // adjust path if needed

// 定义一个DatePicker组件，接收label、value、onChange、styles四个参数
const DatePicker = ({ label = "Birthday", value, onChange, styles }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const handleChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const date = selectedDate;
      setTempDate(date);
      if (Platform.OS === "android") {
        onChange(date);
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIosDate = () => {
    onChange(tempDate);
    toggleDatePicker();
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      {Platform.OS === "web" ? (
        <input
          type="date"
          style={styles.webDatePicker}
          value={value ? new Date(value).toISOString().split("T")[0] : ""}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            onChange(newDate);
            setTempDate(newDate);
          }}
        />
      ) : (
        <>
          {!showDatePicker && (
            <TouchableOpacity style={styles.dobButton} onPress={toggleDatePicker}>
              <TextInput
                placeholder="Select Date"
                style={styles.dobText}
                editable={false}
                value={value ? DateFormatter(value) : ""}
                pointerEvents="none"
              />
            </TouchableOpacity>
          )}
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={tempDate}
              onChange={handleChange}
              style={styles.datePicker}
              maximumDate={new Date()}
            />
          )}
        </>
      )}

      {showDatePicker && Platform.OS === "ios" && (
        <View style={styles.iosDatePicker}>
          <TouchableOpacity onPress={toggleDatePicker} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmIosDate} style={styles.pickerButton}>
            <Text style={[styles.buttonText, { color: "#fff" }]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DatePicker;
