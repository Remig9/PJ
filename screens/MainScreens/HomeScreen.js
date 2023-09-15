import {StyleSheet, View, ScrollView, ImageBackground, Dimensions, Pressable} from "react-native";
import React, {useEffect, useState} from "react";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";

import DealsImage from '../../assets/img/deals.png';
import DrinksImage from '../../assets/img/drinks.png';
import MyText from "../../components/UI/MyText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../helpers/axios";
import {NavigationEvents} from "react-navigation";
import {getOpeningHours} from "../../helpers/time";

const menuHeight = (Dimensions.get('window').height / 3) - 30;

const HomeScreen = ({navigation}) => {
    const [onNavigate, setOnNavigate] = useState(0);
    const [restaurant, setRestaurant] = useState({});

    useEffect(() => {
        const getSettings = async restaurant => {
            try {
                const {data: {data}} = await Api.get(`settings?store_id=${restaurant.id}`);

                const storeOpen = data.store_open;

                const {currentTime, openingHour, closingHour} = getOpeningHours(data.opening_time + ':00', data.closing_time + ':00');

                const isWithinOrderingTime = (currentTime >= openingHour) && (currentTime < closingHour);

                if (!storeOpen) {
                    return alert(`The selected store is closed. Please choose another store close to you.`)
                }

                if (!isWithinOrderingTime) {
                    alert(`You can only order between ${data.opening_time} and ${data.closing_time}`)
                }

            } catch (e) {
                console.log(e.response.data.message);
            }
        };

        AsyncStorage.getItem('selectedStore').then(async res => {
            if (res) {
                const restaurant = JSON.parse(res)
                setRestaurant(restaurant);

                getSettings(restaurant);

                try {
                    const {data: {data: toppings}} = await Api(`/toppings`)

                    AsyncStorage.setItem('toppings', JSON.stringify(toppings));
                } catch (e) {
                    console.log(e);
                }
            }

        })
    }, [onNavigate]);

    const getObjects = () => {
        setOnNavigate(s => s + 1);
    }

    return <>
        <ScrollView style={s.container}>
            <NavigationEvents onWillFocus={() => getObjects()}/>

            <View style={s.viewContainer}>
                <View style={s.menu}>
                    <Pressable onPress={() => navigation.navigate('Deals')}>
                        <ImageBackground source={DealsImage} style={s.menuImage}>
                            <MyText title="DEALS" style={s.menuText} h5/>
                        </ImageBackground>
                    </Pressable>
                </View>

                <View style={s.menu}>
                    <Pressable onPress={() => navigation.navigate('Pizza')}>
                        <ImageBackground source={DealsImage} style={s.menuImage}>
                            <MyText title="PIZZA" style={s.menuText} h5/>
                        </ImageBackground>
                    </Pressable>
                </View>

                <View style={s.menu}>
                    <Pressable onPress={() => navigation.navigate('Drinks')}>
                        <ImageBackground source={DrinksImage} style={s.menuImage}>
                            <MyText title="DRINKS" style={s.menuText} h5/>
                        </ImageBackground>
                    </Pressable>
                </View>
            </View>

        </ScrollView>

        <ScreenHeader title="Ordering From" restaurant={restaurant.store_name} color={Colors.primaryColor} navigation={navigation}/>
    </>
}

export default HomeScreen;

const s = StyleSheet.create({
    container: {
        height: '80%'
    },
    viewContainer: {
        marginTop: 60
        // top: -200
    },
    menu: {},
    menuImage: {
        resizeMode: 'contain',
        alignItems: 'flex-end'
    },
    menuText: {
        marginTop: menuHeight,
        marginBottom: 20,
        marginRight: 30,
        color: 'white',
        fontFamily: 'GilroyBlack'
    }
});
