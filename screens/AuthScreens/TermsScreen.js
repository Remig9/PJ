import {Image, ImageBackground, ScrollView, StyleSheet, View} from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import ScreenHeader from "../../components/UI/ScreenHeader";
import footerImage from "../../assets/img/auth-header.png";
import PizzaJungleRed from "../../assets/img/pjungle-red.png";
import MyText from "../../components/UI/MyText";

export default ({navigation}) => {
    return <>
        <ScrollView>
            <View style={s.container}>
                <Image style={s.pizzaJungleLogo} source={PizzaJungleRed}/>
                <MyText
                    title="Lorem ipsum dolor sit amet, consectetur uhhug adipiscing elit, sed do eiusmod tempor fgfgfg incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ugh hg exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    style={s.terms}
                />
            </View>
        </ScrollView>

        <View style={s.footer}>
            <ImageBackground source={footerImage} style={s.footerImage}/>
        </View>

        <ScreenHeader
            hasBackButton={true}
            hasBackButtonAlt={false}
            hasNavigationDrawerIcon={false}
            hasCartIcon={false}
            title="TERMS OF USE"
            color="white"
            navigation={navigation}
            greenBg
        />
    </>
}

const s = StyleSheet.create({
    footer: {
        height: 10,
        backgroundColor: 'red',
    },
    footerImage: {
        width: '100%',
        height: '100%'
    },
    container: {
        marginTop: 200,
        alignItems: 'center',
        paddingHorizontal: 40
    },
    pizzaJungleLogo: {
        width: 210,
        height: 120
    },
    terms: {
        marginTop: 40,
        textAlign: 'center',
        lineHeight: 25,
        fontFamily: 'GilroyLight',
        fontSize: 16
    }
})
