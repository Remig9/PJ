import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    ImageBackground,
    Pressable,
    Image,
} from "react-native";
import React, {useState} from "react";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import footerImage from "../../assets/img/auth-header.png";
import Api from "../../helpers/axios";

import GreyDot from '../../assets/img/grey-dot.png';
import RedDot from '../../assets/img/red-dot.png';
import MyText from "../../components/UI/MyText";

const NotificationScreen = ({navigation}) => {
    const user = navigation.getParam("user");

    const [notifications, setNotifications] = useState(navigation.getParam('notifications'));
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const {data} = await Api.get(`notifications/${user.customer_id}`);
            setNotifications(data);
        } catch (e) {
            console.log(e);
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications(true);
        setRefreshing(false);
    }

    const markAsRead = async id => {
        if (id !== 'all') {
            const {data} = await Api.post(`notifications/${user.customer_id}/${id}`);
            setNotifications(data);
        } else {
            const {data} = await Api.post(`notifications/${user.customer_id}/mark-all-as-read`);
            console.log(data);
            setNotifications(data);
        }
    }

    const Notification = ({item: {read_at, created, data, id}}) => {
        return <Pressable
            onPress={() => !read_at ? markAsRead(id) : null}
            style={[s.notification, read_at ? s.notificationRead : '']}>

            <View style={s.notificationDetails}>
                <Image style={s.notificationDot} source={read_at ? GreyDot : RedDot}/>
                <MyText title={data.title} style={s.notificationTitle}/>
                <MyText title={created} style={s.notificationTime}/>
            </View>

            <MyText title={data.subtitle} style={s.notificationDetail}/>
        </Pressable>
    }

    return <>
        <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            ListHeaderComponent={
                notifications.length > 0 && <Pressable onPress={() => markAsRead('all')} style={s.markAll}>
                    <Image style={s.readImage} source={RedDot}/>
                    <MyText title="Mark all as read" style={s.markAsRead}/>
                </Pressable>
            }
            contentContainerStyle={s.list}
            keyExtractor={item => item.id.toString()}
            data={notifications}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => <Notification item={item}/>}
        />

        <ScreenHeader
            hasNavigationDrawerIcon={false}
            hasBackButtonAlt={true}
            hasCartIcon={false}
            title="NOTIFICATIONS"
            color={Colors.primaryColor}
            navigation={navigation}
        />

        <View style={s.footer}>
            <ImageBackground source={footerImage} style={s.footerImage}/>
        </View>
    </>
}

export default NotificationScreen;

const s = StyleSheet.create({
    list: {
        marginTop: 170,
        paddingBottom: 200
    },
    footer: {
        height: 10,
        backgroundColor: 'red',
    },
    footerImage: {
        width: '100%',
        height: '100%'
    },
    markAll: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderColor: '#e0e0e0',
    },
    markAsRead: {
        marginBottom: 5,
        fontFamily: 'GilroyMedium',
        fontSize: 17,
        marginLeft: 15,
        letterSpacing: 1,
        marginTop: 3,
        color: Colors.primaryColor
    },
    readImage: {
        width: 20,
        height: 20
    },
    notification: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderBottomWidth: 2,
        borderColor: '#e0e0e0',
        backgroundColor: '#f38c251c'
    },
    notificationRead: {
        backgroundColor: '#ffffff'
    },
    notificationDot: {
        width: 15,
        height: 15
    },
    notificationDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    notificationTitle: {
        fontFamily: 'GilroySemiBold',
        fontSize: 18,
        marginBottom: 15,
        marginTop: -3,
        flex: 1,
        marginLeft: 20
    },
    notificationDetail: {
        fontFamily: 'GilroyMedium',
        fontSize: 14,
        marginLeft: 35,
        letterSpacing: 1
    },
    notificationTime: {
        fontFamily: 'GilroyRegular',
        fontSize: 15,
        marginTop: -3,
    },
})
