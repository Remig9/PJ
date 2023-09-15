import { ScrollView, View, StyleSheet, ImageBackground } from "react-native";
import React, { useState } from "react";
import { PayWithFlutterwave } from "flutterwave-react-native";
import footerImage from "../../assets/img/auth-header.png";
import Colors from "../../constants/Colors";
import ScreenHeader from "../../components/UI/ScreenHeader";
import MyText from "../../components/UI/MyText";
import { useDispatch, useSelector } from "react-redux";
import { firstCharacter, truncateString } from "../../services/typography";
import CustomButton from "../../components/UI/CustomButton";
import { deleteAllCart } from "../../db/databaseTransactions";
import { syncAndDeleteCart } from "../../store/actions/cart";
import Api from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({ navigation }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const [ordering, setOrdering] = useState(null);
  const [paid, setPaid] = useState(false);
  const [balanceApplied, setBalanceApplied] = useState(null);
  const [unusedBalance, setUnusedBalance] = useState(null);

  const totalCost = navigation.getParam("totalCost");
  const deliveryType = navigation.getParam("deliveryType");
  const selectedStore = navigation.getParam("selectedStore");
  const loggedInUser = navigation.getParam("loggedInUser");
  const deliveryCharge = navigation.getParam("deliveryCharge");
  const defaultAddress = navigation.getParam("defaultAddress");
  const deliveryNote = navigation.getParam("deliveryNote");
  const couponAmount = navigation.getParam("couponAmount") || 0;
  const autoProductDiscount = navigation.getParam("autoProductDiscount") || 0;
  const couponID = navigation.getParam("couponID");
  const phoneNumber = navigation.getParam("phoneNumber");

  const [initTotalPrice, setInitTotalPrice] = useState(totalCost);
  const [totalPrice, setTotalPrice] = useState(totalCost);

  React.useEffect(() => {
    const getUnusedBalance = async () => {
      try {
        let { data } = await Api.get(
          `get-unused-balance/${loggedInUser.user_data.user.customer_id}`
        );
        setUnusedBalance(data);
      } catch (e) {
        console.log(e.response.data);
      }
    };

    getUnusedBalance();
  }, []);

  React.useEffect(() => {
    let balanceToApply = 0;
    if (unusedBalance > 0) {
      if (unusedBalance >= initTotalPrice) {
        balanceToApply = initTotalPrice;
      } else {
        balanceToApply = unusedBalance;
      }
    }
    setBalanceApplied(balanceToApply);
    setTotalPrice(initTotalPrice - balanceToApply);
  }, [unusedBalance]);

  const getTransactionRef = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleOnRedirect = async ({ status, transaction_id, tx_ref }) => {
    if (status === "cancelled") {
      setOrdering(null);
      return;
    }

    setPaid(true);
    if (!paid && status === "successful") {
      await deleteAllCart();
      dispatch(syncAndDeleteCart());

      let orderId = await AsyncStorage.getItem("lastOrderID");

      try {
        await Api.post(`orders/${orderId}/update-payment`, {
          amount_paid: totalCost,
          payment_ref: transaction_id,
          retrieval_ref: tx_ref,
          reference_number: tx_ref,
          source: "Flutterwave",
        });
        navigation.navigate("OrderPlaced");
      } catch (e) {
        console.log(e.response);
      }
    }
  };

  const initOrder = (paid = false, paymentType = "flutterwave") => {
    return new Promise(async (resolve, reject) => {
      if (paymentType === "flutterwave") {
        setOrdering("flutterwave");
      } else {
        setOrdering("pod");
      }

      const orderItems = [...cart.cart].map((item) => ({
        product_id: item.product_id,
        order_size: item.pizza_size,
        price: item.product_price,
        quantity: item.quantity,
        subtotal: item.product_subtotal,
        amount: item.total_price,
        pizza_crust: item.crust_type,
        pizza1: item.pizza1,
        pizza2: item.pizza2,
        pizza3: item.pizza3,
        pizza4: item.pizza4,
        pizza5: item.pizza5,
        pizza6: item.pizza6,
        toppings: JSON.parse(item.toppings),
      }));

      const user = loggedInUser.user_data.user;

      const orderData = {
        order_type: deliveryType,
        subtotal: cart.totalPrice,
        delivery_fee: deliveryCharge,
        grand_total: totalPrice,
        store_id: selectedStore.id,
        delivery_address_id:
          deliveryType === "delivery" ? defaultAddress.id : null,
        customer_id: user.customer_id,
        delivery_instruction: deliveryNote,
        order_reference: getTransactionRef(14),
        order_items: orderItems,
        has_paid: paid ? 1 : 0,
        discount_payment: couponAmount + autoProductDiscount,
        payment_method: paymentType,
      };

      if (balanceApplied > 0) {
        orderData.balance_applied = balanceApplied;
        orderData.balance_left = unusedBalance - balanceApplied;
      }

      if (deliveryType === "pickup") {
        orderData["customer_phone"] = phoneNumber;
      }

      try {
        const {
          data: { data },
        } = await Api.post("orders", orderData);

        let user = await AsyncStorage.getItem("userData");

        if (user) {
          const userData = JSON.parse(user);
          userData.user_data.user.ftu = 0;

          AsyncStorage.setItem("userData", JSON.stringify(userData));
        }

        AsyncStorage.setItem("lastOrderID", JSON.stringify(data.order_id));
        AsyncStorage.setItem(
          "lastReferenceNo",
          JSON.stringify(data.reference_no)
        );

        if (paid) {
          await deleteAllCart();
          dispatch(syncAndDeleteCart());

          navigation.navigate("OrderPlaced");
        } else {
          if (paymentType === "pod") {
            await deleteAllCart();
            dispatch(syncAndDeleteCart());
            setOrdering(null);

            navigation.navigate("OrderPlaced");
          }
          resolve(true);
        }
      } catch (e) {
        setOrdering(null);
        console.log(e.response.data);
        resolve(false);
      }
    });
  };

  return (
    <>
      <ScrollView>
        <View style={s.checkoutHeaderContainer}>
          <View style={s.headerRow}>
            <MyText h1 title="Your Order" style={s.headerText} />
            {/*<View style={s.reference}>*/}
            {/*    <MyText style={s.referenceLabel} title='REFERENCE ID'/>*/}
            {/*    <MyText style={s.referenceText} title='124DRTC134TDFY'/>*/}
            {/*</View>*/}
          </View>

          {cart.cart.map((cartItem) => (
            <View key={cartItem.id} style={s.cartItemRow}>
              {cartItem.pizza_size && cartItem.product_type !== "drink" && (
                <MyText
                  title={`${truncateString(
                    cartItem.product_name,
                    20
                  )} (${firstCharacter(cartItem.pizza_size)}) x ${
                    cartItem.quantity
                  }`}
                  style={s.label}
                />
              )}
              {!cartItem.pizza_size && cartItem.product_type !== "drink" && (
                <MyText
                  title={`${truncateString(cartItem.product_name, 20)} x ${
                    cartItem.quantity
                  }`}
                  style={s.label}
                />
              )}
              {cartItem.product_type === "drink" && (
                <MyText
                  title={`${truncateString(cartItem.product_name, 20)} (${
                    cartItem.pizza_size
                  }) x ${cartItem.quantity}`}
                  style={s.label}
                />
              )}

              <MyText
                title={`₦${(+cartItem.total_price).toLocaleString()}`}
                style={s.price}
              />
            </View>
          ))}
        </View>

        {couponAmount > 0 && (
          <View style={s.greenSection}>
            <MyText title="Coupon Amount" style={s.label} />
            <MyText
              title={`-₦${couponAmount.toLocaleString()}`}
              style={s.price}
            />
          </View>
        )}

        {autoProductDiscount > 0 && (
          <View style={s.greenSection}>
            <MyText title="Product Discount Applied" style={s.label} />
            <MyText
              title={`-₦${autoProductDiscount.toLocaleString()}`}
              style={s.price}
            />
          </View>
        )}

        {balanceApplied > 0 && (
          <View style={s.greenSection}>
            <MyText title="Balance Applied" style={s.label} />
            <MyText
              title={`-₦${balanceApplied.toLocaleString()}`}
              style={s.price}
            />
          </View>
        )}

        {deliveryType === "delivery" && (
          <View style={s.greenSection}>
            <MyText title="Delivery Charge" style={s.label} />
            <MyText title={`₦${+deliveryCharge || 0}`} style={s.price} />
          </View>
        )}

        <View style={s.greenSection}>
          <MyText title="Total" style={s.price} />
          <MyText title={`₦${totalPrice.toLocaleString()}`} style={s.price} />
        </View>

        <View style={{ ...s.whiteSection, flexDirection: "column" }}>
          {totalPrice > 0 && loggedInUser && totalCost && (
            <PayWithFlutterwave
              onRedirect={handleOnRedirect}
              options={{
                tx_ref: `pizza-jungle-${Math.floor(
                  Math.random() * 99999999999
                )}-fl`,
                authorization: "FLWPUBK-0e774ab309111e7570a45ffa4bd52db5-X",
                // authorization: 'FLWPUBK_TEST-8088fffdc0d59263e1f7a490f6fc76c8-X',
                customer: {
                  email: loggedInUser.user_data.user.customer_emailaddress,
                },
                // amount: 3000,
                amount: totalCost,
                currency: "NGN",
                payment_options: "card",
              }}
              customButton={(props) => (
                <CustomButton
                  style={{ ...s.continueBtn, marginBottom: 20 }}
                  onPress={async () => {
                    try {
                      const res = await initOrder(false);
                      if (res) {
                        props.onPress();
                      }
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                  title="Pay with Flutterwave"
                  disabled={!!ordering}
                  textStyle={s.continueBtnText}
                  isLoading={ordering === "flutterwave"}
                />
              )}
            />
          )}
          {totalPrice > 0 && deliveryType === "delivery" && (
            <CustomButton
              style={{ ...s.continueBtn, marginBottom: 20 }}
              onPress={() => initOrder(false, "pod")}
              title="Pay with POS"
              disabled={!!ordering}
              textStyle={s.continueBtnText}
              isLoading={ordering === "pod"}
            />
          )}
          {totalPrice === 0 && (
            <CustomButton
              style={s.continueBtn}
              onPress={() => initOrder(true, "pod")}
              title="Order Now"
              disabled={!!ordering}
              textStyle={s.continueBtnText}
              isLoading={ordering === "pod"}
            />
          )}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <ImageBackground source={footerImage} style={s.footerImage} />
      </View>

      <ScreenHeader
        hasBackButtonAlt={true}
        hasNavigationDrawerIcon={false}
        hasCartIcon={false}
        title="PAYMENT"
        color={Colors.primaryColor}
        navigation={navigation}
      />
    </>
  );
};

const s = StyleSheet.create({
  checkoutHeaderContainer: {
    backgroundColor: Colors.checkoutGreen,
    paddingTop: 180,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    color: "white",
  },
  footer: {
    height: 10,
    backgroundColor: "red",
  },
  footerImage: {
    width: "100%",
    height: "100%",
  },
  reference: {
    alignItems: "flex-end",
  },
  referenceLabel: {
    fontFamily: "GilroyLight",
    fontSize: 15,
    color: Colors.primaryColor,
    marginBottom: 7,
  },
  referenceText: {
    fontFamily: "GilroyLight",
    fontSize: 15,
    color: "white",
  },
  cartItemRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  label: {
    color: "white",
    fontFamily: "GilroyLight",
    fontSize: 18,
  },
  price: {
    color: "white",
    fontFamily: "GilroyBlack",
    fontSize: 18,
  },
  greenSection: {
    paddingHorizontal: 30,
    paddingVertical: 25,
    marginTop: 10,
    backgroundColor: Colors.checkoutGreen,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  whiteSection: {
    paddingHorizontal: 30,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  continueBtn: {
    backgroundColor: Colors.lightGreen,
    marginBottom: 60,
  },
  continueBtnText: {
    color: "white",
  },
});
