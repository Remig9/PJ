import {View, ScrollView, StyleSheet, Image, Linking, Platform, ImageBackground} from "react-native";
import React from 'react';
import Colors from "../../constants/Colors";
import MyText from "../../components/UI/MyText";
import ScreenHeader from "../../components/UI/ScreenHeader";
import footerImage from "../../assets/img/auth-header.png";
import CustomButton from "../../components/UI/CustomButton";
import RedDot from '../../assets/img/red-dot.png';

export default ({navigation}) => {
    const order = navigation.getParam('order');

    return <>
        <ScrollView style={s.container}>
            <View style={s.headerView}>
                <MyText title={`Order ID: #${order.id}`} style={s.orderIDText} h3/>

                {
                    order.ordertype === 'delivery' && <View style={s.driverView}>
                        <View>
                            <MyText title={order.rider ? order.rider.rider_name : "Not Yet Assigned"}
                                    style={s.driverName}/>
                            <MyText title="Your Driver" style={s.driverLabel}/>
                        </View>

                        {
                            order.rider && <CustomButton
                                style={s.contactBtn}
                                title="contact"
                                textStyle={s.contactBtnText}
                                onPress={() => {
                                    Linking.openURL(Platform.OS === 'android' ? `tel:${order.rider.rider_phone}` : `telprompt:${order.rider.rider_phone}`)
                                }}
                            />
                        }
                    </View>
                }
            </View>


            <View style={s.statusesView}>

                {
                    order.order_statuses.reverse().map((history, index) => <View key={history.id}
                                                                      style={[s.status, index > 0 ? s.greyStatus : '']}>
                            <Image source={RedDot} style={s.statusImage}/>

                            <View style={s.statusDetails}>
                                <MyText title={history.status} style={s.statusDetails}/>
                                <MyText title={history.created_at} style={s.statusTime}/>
                            </View>

                        </View>
                    )
                }
            </View>
        </ScrollView>


        <ScreenHeader
            hasCartIcon={false}
            title="TRACK ORDER"
            color={Colors.primaryColor}
            navigation={navigation}
        />

        <View style={s.footer}>
            <ImageBackground source={footerImage} style={s.footerImage}/>
        </View>
    </>
}

const s = StyleSheet.create({
    container: {
        padding: 30,
        marginTop: 150
    },
    headerView: {},
    orderIDText: {
        fontFamily: 'GilroySemiBold',
        fontSize: 18,
        marginBottom: 15,
        flex: 1,
    },
    driverView: {
        marginVertical: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    driverName: {
        fontFamily: 'GilroySemiBold',
        fontSize: 18,
        marginBottom: 10
    },
    driverLabel: {
        fontFamily: 'GilroyMedium',
        fontSize: 16
    },
    contactBtn: {
        height: '100%',
        width: 'auto',
        alignItems: 'center',
        backgroundColor: Colors.checkoutGreen
    },
    contactBtnText: {
        textTransform: 'capitalize',
        color: 'white'
    },
    statusesView: {
        borderTopWidth: .5,
        borderTopColor: Colors.grey,
        marginTop: 20
    },
    status: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginLeft: -10,
        marginRight: 0,
        marginVertical: 20,
        position: 'relative'
    },
    greyStatus: {
        opacity: .4
    },
    statusImage: {
        width: 30,
        height: 30,
        marginRight: 30
    },
    statusDetails: {
        flex: 1,
        justifyContent: 'center',
        fontFamily: 'GilroySemiBold',
        fontSize: 18,
        marginBottom: 10
    },
    statusTime: {
        fontFamily: 'GilroyMedium',
        fontSize: 16,
        color: Colors.greyText
    },
    footer: {
        height: 10,
        backgroundColor: 'red',
    },
    footerImage: {
        width: '100%',
        height: '100%'
    },
})
