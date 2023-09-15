import MyText from "./MyText";
import {TouchableOpacity} from "react-native";
import React from "react";
import {Checkbox} from "react-native-paper";

export default ({onPress, title, checked = false, labelStyle}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                marginRight: 5,
            }}
        >
            <Checkbox.Android
                status={checked ? 'checked' : 'unchecked'}
                onPress={onPress}
            />
            <MyText
                title={title}
                h6
                style={[{color: "black"}, labelStyle]}
            />
        </TouchableOpacity>
    );
}
