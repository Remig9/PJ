import React from "react";
import Input from "./Input";
import {Controller} from "react-hook-form";
import MyText from "./MyText";
import {TouchableOpacity, View, StyleSheet, Platform} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import Colors from "../../constants/Colors";

export default ({
                    name,
                    control,
                    defaultValue = '',
                    autoCompleteType = 'off',
                    placeholder = '',
                    keyboardType = 'default',
                    returnType = 'next',
                    errorMessage,
                    passwordInput = false,
                    style={},
                    multiline = false,
                    noOfLines = 1,
                    autoCapitalize = "none",
                    innerRef,
                    onSubmitEditing,
                    editable
                }) => {
    const [icon, setIcon] = React.useState('md-eye-off');
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
        setIcon(s => s === 'md-eye-off' ? 'md-eye' : 'md-eye-off');
        setShowPassword(s => !s);
    }

    return <Controller
        name={name}
        defaultValue={defaultValue}
        control={control}
        render={({onChange, value}) => (
            <>
                <View style={{flexDirection: 'row'}}>
                    <Input
                        innerRef={innerRef}
                        onSubmitEditing={onSubmitEditing}
                        autoCapitalize={autoCapitalize}
                        autoCompleteType={autoCompleteType}
                        onChangeText={text => {
                            onChange(text);
                        }}
                        defaultValue={value}
                        value={value}
                        placeholder={placeholder}
                        keyboardType={keyboardType}
                        returnKeyType={returnType}
                        secureTextEntry={passwordInput && !showPassword}
                        style={style}
                        multiline={multiline}
                        numberOfLines={Platform.OS === 'ios' ? null : noOfLines}
                        minHeight={(Platform.OS === 'ios' && noOfLines) ? (20 * noOfLines) : null}
                        editable={editable}
                        placeholderTextColor={Colors.grey}
                    />
                    {
                        passwordInput && <TouchableOpacity onPress={togglePasswordVisibility} style={s.eye}>
                            <Ionicons name={icon} size={20} color="black"/>
                        </TouchableOpacity>
                    }
                </View>

                <MyText style={{color: "red"}} p title={errorMessage}/>
            </>
        )}
    />
}

const s = StyleSheet.create({
    eye: {
        position: 'absolute',
        right: 0,
        bottom: 20
    }
})

