import {Pressable, Text, StyleSheet, ActivityIndicator} from "react-native";
import React from "react";

export default ({title = 'Enter', textCenter = true, style = {}, textStyle = {}, onPress, disabled, indicatorColor = '#ffffff', isLoading = false, innerRef, children}) => {

    return (
        <Pressable
            ref={innerRef}
            disabled={disabled}
            onPress={!isLoading ? onPress : () => {}}
            style={[{...styles.button, justifyContent: textCenter ? 'center' : 'flex-start'}, style, (disabled || isLoading) ? styles.disabled : {}]}
        >
            {children}
            {!isLoading && <Text style={[styles.text, textStyle]}>{title}</Text>}
            {isLoading && <ActivityIndicator size="small" color={indicatorColor}/>}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        display: 'flex',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 3,
        width: '100%',
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
    },

    disabled: {
        opacity: 0.75
    },

    text: {
        fontSize: 16,
        textTransform: 'uppercase',
        color: '#000000',
        fontFamily: 'GilroyBold'
    }
});
