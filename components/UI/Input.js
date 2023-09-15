import React from 'react'
import {TextInput, StyleSheet, View} from "react-native";
import Colors from "../../constants/Colors";

const Input = props => {
    return <TextInput {...props} ref={props.innerRef} style={[styles.input, props.style]}/>
};

const styles = StyleSheet.create({
    input: {
        borderBottomColor: Colors.grey,
        borderBottomWidth: 1,
        marginVertical: 10,
        fontFamily: 'GilroyLight',
        fontSize: 16,
        paddingVertical: 5,
        width: '100%'
    }
});

export default Input;
