import {Image, ImageBackground, ScrollView, StyleSheet, View, Platform} from "react-native";
import React from "react";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import PizzaJungleRed from "../../assets/img/pjungle-red.png";
import MyText from "../../components/UI/MyText";
import footerImage from "../../assets/img/auth-header.png";
import CustomButton from "../../components/UI/CustomButton";
import * as Linking from "expo-linking";

export default ({navigation}) => {

    return <View style={{backgroundColor: 'white', height: '100%'}}>

        <ScrollView>
            <View style={s.container}>
                <Image style={s.pizzaJungleLogo} source={PizzaJungleRed}/>
                <MyText
                    title="To make request for further information, contact us via the following options."
                    style={s.terms}
                />

                <CustomButton style={s.button} onPress={() => {Linking.openURL(Platform.OS === 'android' ? 'tel:+2348156870023' : 'telprompt:+2348156870023')}} title="Give us a call" textStyle={s.btnText} />
                <CustomButton style={s.button} onPress={() => {Linking.openURL('https://api.whatsapp.com/send?phone=2348156870023');}} title="live chat via whatsapp" textStyle={s.btnText} />
            </View>

        </ScrollView>

        <View style={s.footer}>
            <ImageBackground source={footerImage} style={s.footerImage}/>
        </View>

        <ScreenHeader
            hasCartIcon={false}
            title="CONTACT US"
            color={Colors.primaryColor}
            navigation={navigation}
        />

    </View>
}

const s = StyleSheet.create({
    container: {
        marginTop: 200,
        alignItems: 'center',
        paddingHorizontal: 40
    },
    pizzaJungleLogo: {
        width: 210,
        height: 120
    },
    footer: {
        height: 10,
        backgroundColor: 'red',
    },
    footerImage: {
        width: '100%',
        height: '100%'
    },
    terms: {
        marginTop: 40,
        textAlign: 'center',
        lineHeight: 25,
        fontFamily: 'GilroyLight',
        fontSize: 16
    },
    button: {
        backgroundColor: Colors.lightGreen,
        marginTop: 30
    },
    btnText: {
        color: 'white'
    }
});
