import {
    FlatList,
    Image,
    View,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import React, {useEffect, useState} from "react";
import MyText from "../../components/UI/MyText";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/UI/CustomButton";
import AddedToCartModal from "../../components/UI/AddedToCartModal";
import footerImage from "../../assets/img/auth-header.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../helpers/axios";
import {addItemToCart} from "../../services/cartService";
import {useDispatch} from "react-redux";
import {syncAndDeleteCart} from "../../store/actions/cart";

export default ({navigation}) => {
    const dispatch = useDispatch();

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [orderLoading, setOrderLoading] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
        setLoadingOrders(true)
        fetchAllOrders(false);
    }, [])

    const fetchAllOrders = (refresher = false) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('userData').then(async res => {
                const jsonValue = JSON.parse(res);
                if (!jsonValue) {
                    setIsAuthenticated(false)
                    reject(false);
                    return;
                }
                const user = jsonValue.user_data.user;

                try {
                    const {data: {data}} = await Api(`orders/customer-orders?customer_id=${user.customer_id}`);
                    setOrders(data);
                    if (!refresher)
                        setLoadingOrders(false);
                    resolve(true);
                } catch (e) {
                    if (!refresher)
                        setLoadingOrders(false);
                    console.log(e);
                    reject();
                }
            })
        })
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAllOrders(true);
        setRefreshing(false);
    }

    const reOrderHandler = async (orderId) => {
        setOrderLoading(orderId);
        await syncAndDeleteCart();

        try {
            const {data} = await Api(`orders/${orderId}/re-order`);
            data.forEach((item, i) => {
                addItemToCart(
                    dispatch, [], item.item, item.quantity, +item.subtotal, +item.totalPrice,
                    +item.productPrice * item.quantity, item.pizza1, item.pizza2, item.crustType,
                    item.pizzaSize, item.selectedToppings, item.product_type,
                    () => {
                        if (i === data.length - 1) {
                            setModalVisible(true);
                            setOrderLoading(null)
                        }
                    }, item.pizza3, item.pizza4, item.pizza5, item.pizza6
                )
            })
        } catch (e) {
            setOrderLoading(null);
            console.log(e.response.data, 're-order fetch failed');
        }
    }

    const Order = ({order}) => <View style={s.order}>
        <View style={s.orderTopRow}>
            <Image source={{uri: order.order_items[0].product.productimage}} style={s.dealImage}/>
            <View style={s.orderDetail}>
                <MyText style={s.orderRef} title={`#${order.id}`}/>
                <MyText style={s.orderRef} title={order.formatted_date}/>
            </View>
        </View>

        {
            order.order_items.map(item => <View key={item.id} style={s.orderRow}>
                <MyText style={s.orderProduct} title={`${item.quantity}x ${item.product?.productname || ''}`}/>
                <MyText style={s.orderProduct} title={`₦${(Math.trunc(item.totalamount).toLocaleString())}`}/>
            </View>)
        }

        <View style={s.bottomRow}>
            <CustomButton style={s.trackOrderBtn} onPress={() => navigation.navigate('TrackOrder', {order})} textStyle={s.orderBtnTxt} title="Track order"/>
            <CustomButton style={s.repeatOrderBtn} onPress={() => reOrderHandler(order.id)} textStyle={s.orderBtnTxt}
                          isLoading={orderLoading === order.id} title="Repeat order"/>
        </View>

        <AddedToCartModal
            modalVisible={modalVisible}
            continueHandler={() => {
                setModalVisible(false);
                navigation.navigate('Home');
            }}
            cartHandler={() => {
                setModalVisible(false);
                navigation.navigate("Cart");
            }}
        />

    </View>

    return <>
        {
            isAuthenticated && (loadingOrders ? (
                <ActivityIndicator size="large" color={Colors.gold} style={{flex: 1}}/>
            ) : (
                <>
                    <FlatList
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                        style={s.flatListContainer}
                        contentContainerStyle={s.list}
                        keyExtractor={item => item.id.toString()}
                        data={orders}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index}) => <Order order={item}/>}
                    />
                </>
            ))
        }

        <ScreenHeader
            title="ORDERS"
            color={Colors.primaryColor}
            navigation={navigation}
        />

        <View style={s.footer}>
            <ImageBackground source={footerImage} style={s.footerImage}/>
        </View>

        {
            !isAuthenticated && <View style={s.loginBtnContainer}>
                <CustomButton
                    title="Login To Continue"
                    onPress={async () => {
                        await AsyncStorage.setItem('redirectTo', 'orders');
                        return navigation.navigate('SignIn');
                    }}
                    style={s.loginBtn}
                    textStyle={s.signOutText}
                />
            </View>
        }
    </>
}

const s = StyleSheet.create({
    list: {
        marginTop: 150,
        paddingHorizontal: 30,
        paddingBottom: 200
    },
    order: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 4,
    },
    orderTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    dealImage: {
        width: 75,
        height: 50
    },
    orderDetail: {
        alignItems: 'flex-end'
    },
    orderRef: {
        fontFamily: 'GilroyBlack',
        color: Colors.gold,
        marginVertical: 2
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    orderProduct: {
        fontFamily: 'GilroyLight',
        fontSize: 15,
        color: '#0B2031',
        marginVertical: 5
    },
    bottomRow: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    trackOrderBtn: {
        // width: '50%',
        flex: 1,
        backgroundColor: Colors.checkoutGreen,
        paddingVertical: 10,
        paddingHorizontal: 0,
        marginRight: 7
    },
    orderBtnTxt: {
        fontSize: 14,
        color: 'white'
    },
    repeatOrderBtn: {
        // width: '50%',
        flex: 1,
        backgroundColor: Colors.lightGreen,
        paddingVertical: 10,
        paddingHorizontal: 0,
        marginLeft: 7
    },
    footer: {
        height: 10,
        backgroundColor: 'red',
    },
    footerImage: {
        width: '100%',
        height: '100%'
    },
    loginBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 200,
        width: '100%'
    },
    loginBtn: {
        backgroundColor: Colors.lightGreen,
        paddingVertical: 10,
        paddingHorizontal: 0,
        width: '50%'
    },
    signOutText: {
        color: 'white'
    },
})
