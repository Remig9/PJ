import {Image, ImageBackground, ScrollView, StyleSheet, View} from "react-native";
import React, {useEffect, useState} from "react";
import footerImage from "../../assets/img/auth-header.png";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import MyText from "../../components/UI/MyText";
import WildGreen from "../../assets/img/wild-green.png";

import PizzaJungleRed from '../../assets/img/pjungle-red.png'
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/UI/CustomButton";

export default ({navigation}) => {
    const [referenceNo, setReferenceNo] = useState('');

    useEffect(() => {
        AsyncStorage.getItem("lastReferenceNo").then(res => {
            setReferenceNo(JSON.parse(res));
        })

        AsyncStorage.setItem('showRating', '1');
    }, [])

    return <>
        <ScrollView>
            <View style={s.container}>
                <Image style={s.pizzaJungleLogo} source={PizzaJungleRed}/>
                <MyText title="REFERENCE NUMBER" style={s.referenceLabel}/>
                <MyText title={referenceNo} style={s.referenceNumber}/>

                <MyText title="Thank you for ordering." style={s.thankYou}/>
                <MyText title="YOUR ORDER HAS BEEN PLACED" style={s.orderPlaced}/>
            </View>

            <Image source={WildGreen} style={s.wildImage}/>

            <View style={{flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
                <CustomButton title="Back Home" style={s.continueOrdering}
                              textStyle={s.continueOrderingText} onPress={() => navigation.navigate('Home')}/>
            </View>


        </ScrollView>

        <View style={s.footer}>
            <ImageBackground source={footerImage} style={s.footerImage}/>
        </View>

        <ScreenHeader
            hasBackButtonAlt={false}
            hasNavigationDrawerIcon={false}
            hasCartIcon={false}
            title=""
            color={Colors.primaryColor}
            navigation={navigation}
            backFunction={() => navigation.popToTop()}
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
        alignItems: 'center'
    },
    pizzaJungleLogo: {
        width: 210,
        height: 120
    },
    referenceLabel: {
        fontFamily: 'GilroyLight',
        fontSize: 15,
        color: Colors.gold,
        marginTop: 20
    },
    referenceNumber: {
        fontFamily: 'GilroyLight',
        fontSize: 15,
        color: Colors.grey,
        marginTop: 10
    },
    thankYou: {
        fontFamily: 'GilroyLight',
        fontSize: 15,
        color: Colors.grey,
        marginTop: 40
    },
    orderPlaced: {
        fontFamily: 'GilroyBlack',
        fontSize: 30,
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 45,
        width: '60%'
    },
    wildImage: {
        width: 290,
        height: 150,
        marginTop: 30,
        marginBottom: 30
    },
    continueOrdering: {
        backgroundColor: Colors.lightGreen,
        width: '40%'
    },
    continueOrderingText: {
        color: 'white',
        fontSize: 14
    },
});
