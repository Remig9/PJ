import {Image, StyleSheet} from "react-native";
import React from "react";
import CustomButton from "./CustomButton";
import appleIcon from '../../assets/img/apple-logo.png';

const AppleButton = ({onPress, loginIn, title = 'APPLE'}) => {
    return <CustomButton
        textCenter={false}
        title={title}
        isLoading={loginIn}
        onPress={onPress}
        style={[styles.apple, styles.iosButtons]}
        textStyle={{color: 'white', fontFamily: 'UbuntuRegular', textTransform: 'none'}}
    >
        <Image source={appleIcon} style={styles.appleLogo}/>
    </CustomButton>
}

export default AppleButton;

const styles = StyleSheet.create({
    apple: {
        backgroundColor: '#000000',
        borderColor: '#4267B2',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: 200,
        paddingHorizontal: 20,
        paddingVertical: 0,
        paddingLeft: 5,
        height: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
        elevation: 5,
    },
    appleLogo: {
        width: 28,
        height: 28,
        marginRight: 15,
        top: -4
    },
    iosButtons: {
        marginBottom: 10
    }
});
