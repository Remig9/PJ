import MyText from "./MyText";
import React from "react";
import {View, StyleSheet, TouchableOpacity, Dimensions, Image, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";

import GoBackIcon from '../../assets/img/go-back.png';
import CartIcon from '../../assets/img/cart-icon.png';
import {useSelector} from "react-redux";

export default ({
                    title,
                    color,
                    greenBg = false,
                    hasBackButton = false,
                    hasBackButtonAlt = false,
                    navigation,
                    backgroundColor = Colors.primaryColor,
                    hasNavigationDrawerIcon = true,
                    hasCartIcon = true,
                    backFunction = () => navigation.goBack(),
                    restaurant = null
                }) => {

    const cart = useSelector(s => s.cart);

    return <View style={[s.container, {backgroundColor}]}>
        <View style={s.content}>
            {
                hasBackButton && <>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backButtonContainer}>
                        <Ionicons name="md-arrow-back" size={30} color={greenBg ? 'white' : Colors.primaryColor}/>
                    </TouchableOpacity>

                    <MyText title={title} h1 style={[s.headingText, {color: color, textAlign: 'center'}]}/>
                </>
            }

            {
                !hasBackButton && <View style={s.mainContent}>

                    {/*{*/}
                    {/*    hasNavigationDrawerIcon && <TouchableOpacity onPress={() => navigation.toggleDrawer()}>*/}
                    {/*        <Image source={DrawerIcon} style={s.drawerIcon}/>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*}*/}

                    {
                        hasNavigationDrawerIcon && <View style={s.drawerIcon}>
                            {/*<Image source={DrawerIcon} style={s.drawerIcon}/>*/}
                        </View>
                    }

                    {
                        hasBackButtonAlt && <TouchableOpacity onPress={backFunction}>
                            <Image source={GoBackIcon} style={s.drawerIcon}/>
                        </TouchableOpacity>
                    }

                    <View>
                        { !restaurant && <MyText title={title} h1 style={s.headingMainText}/> }

                        {
                            restaurant && <>
                                <MyText title={title} h2 style={s.headingMainText}/>
                                <MyText title={`${restaurant}`} p style={[s.headingMainText, {marginTop: 10}]}/>
                                <TouchableOpacity
                                    onPress={async () => {
                                        navigation.navigate('Location')
                                    }}
                                    style={{...s.headingMainText, alignItems: 'center'}}
                                >
                                    <MyText title={"change location"} p style={[s.locationBtn, s.headingMainText]}/>
                                </TouchableOpacity>
                            </>
                        }
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                        <Image source={CartIcon} style={[s.cartIcon, {opacity: hasCartIcon ? 1 : 0}]}/>
                        <View style={[s.cartCounterContainer, {opacity: hasCartIcon ? 1 : 0}]}>
                            <MyText h5 title={cart.quantity} style={s.cartCounter}/>
                        </View>
                    </TouchableOpacity>
                </View>
            }

        </View>
    </View>
}

const s = StyleSheet.create({
    container: {
        height: 240,
        paddingVertical: '10%',
        width: Dimensions.get('window').width + 100,
        borderBottomLeftRadius: 1100,
        borderBottomRightRadius: 1100,
        left: -50,
        top: -80,
        position: 'absolute',
        overflow: 'hidden',
    },
    content: {
        marginTop: 80,
        marginHorizontal: 50
    },
    backButtonContainer: {
        marginTop: 0,
        marginLeft: 20
    },
    headingText: {
        textAlign: 'center',
        marginTop: 0
    },
    headingMainText: {
        textAlign: 'center',
        color: 'white',
    },
    locationBtn: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginTop: 10
    },
    mainContent: {
        flexDirection: 'row',
        marginHorizontal: 30,
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    drawerIcon: {
        width: 40,
        height: 40
    },
    cartIcon: {
        width: 40,
        height: 40
    },
    cartCounterContainer: {
        position: 'absolute',
        right: 0,
        top: -3,
        width: 18,
        height: 18,
        backgroundColor: 'white',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartCounter: {
        fontSize: 12,
        color: Colors.gold
    }
});
