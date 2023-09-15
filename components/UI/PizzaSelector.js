import { View, StyleSheet, Platform } from "react-native";
import React from "react";
import MyText from "./MyText";
import Colors from "../../constants/Colors";
import RNPickerSelect from "react-native-picker-select";
import { Entypo } from "@expo/vector-icons";
// import { Chevron } from "react-native-shapes";

export default ({
  title,
  items,
  placeholder = "",
  cb = null,
  containerStyle = {},
  selectStyle = {},
}) => {
  return (
    <View style={[s.container, containerStyle]}>
      <MyText title={title} style={s.labelTitle} />

      <View style={[s.selectContainer, selectStyle]}>
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: placeholder,
            value: undefined,
          }}
          placeHolderTextColor={Colors.primaryColor}
          onValueChange={cb}
          items={items}
          style={{ ...pickerSelectStyles }}
          Icon={() => (
            <Entypo name='chevron-down' size={24} color={Colors.primaryColor} />
          )}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: Colors.gold,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  labelTitle: {
    color: "white",
    fontFamily: "GilroyBlack",
    fontSize: 15,
  },
  selectContainer: {
    width: "60%",
  },
});

const inputStyles = {
  fontSize: 16,
  color: "white",
  fontFamily: "GilroyRegular",
  justifyContent: "flex-start",
};

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    ...inputStyles,
  },
  inputIOS: {
    ...inputStyles,
  },
  iconContainer: {
    top: Platform.OS === "android" ? 10 : 5,
    right: 0,
  },
  placeholder: {
    color: "white",
    fontFamily: "GilroyRegular",
    fontSize: 16,
    marginRight: 40,
  },
});
