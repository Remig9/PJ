import {Image, StyleSheet, Dimensions, Platform} from "react-native";
import CustomButton from "./CustomButton";
import React from "react";

import facebookIcon from '../../assets/img/facebook.png';

const FacebookButton = ({onPress, loginIn}) => {
    return <CustomButton
        textCenter={false}
        title="Facebook"
        isLoading={loginIn}
        onPress={onPress}
        style={[styles.facebook, Platform.OS === 'ios' && styles.iosButtons]}
        textStyle={{color: 'white', fontFamily: 'UbuntuRegular'}}
    >
        <Image source={facebookIcon} style={styles.facebookLogo}/>
    </CustomButton>
}

export default FacebookButton;

const styles = StyleSheet.create({
    facebook: {
        backgroundColor: '#435A9B',
        borderColor: '#435A9B',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 0,
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
    facebookLogo: {
        width: 28,
        height: 28,
        marginRight: 15,
        top: -4
    },
    iosButtons: {
        marginBottom: 10
    }
});
