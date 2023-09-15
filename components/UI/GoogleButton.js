import Colors from "../../constants/Colors";
import {Image, StyleSheet} from "react-native";
import CustomButton from "./CustomButton";
import React from "react";

import googleIcon from '../../assets/img/google.png';

const GoogleButton = ({onPress, loginIn}) => {
    return <CustomButton
        textCenter={false}
        title="Google"
        isLoading={loginIn}
        indicatorColor={Colors.primaryColor}
        onPress={onPress}
        style={styles.google}
        textStyle={{color: Colors.grey, fontFamily: 'UbuntuRegular'}}
    >
        <Image source={googleIcon} style={styles.googleLogo} />
    </CustomButton>
}

export default GoogleButton;

const styles = StyleSheet.create({
    google: {
        backgroundColor: 'white',
        borderColor: '#707070',
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
    googleLogo: {
        width: 33,
        height: 33,
        marginRight: 10,
        backgroundColor: 'white',
        // top: -1,
        // borderRadius: 3
    }
});
