import Colors from "../../constants/Colors";
import MyText from "./MyText";
import {TouchableOpacity} from "react-native";
import React from "react";
import {RadioButton} from "react-native-paper";

export default ({onPress, title, value, radioKey, checked = false, labelStyle}) => {
    return <TouchableOpacity
        onPress={onPress}
        style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            marginRight: 5,
        }}
    >
        <RadioButton
            value={value}
            color={Colors.lightGreen}
            key={radioKey}
            uncheckedColor={Colors.lightGreen}
            status={checked}
            onPress={onPress}
        />
        <MyText
            title={title}
            h6
            style={[{color: "black"}, labelStyle]}
        />
    </TouchableOpacity>
}
