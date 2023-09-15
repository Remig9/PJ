import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  FlatList,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import MyText from "../../components/UI/MyText";
import CustomButton from "../../components/UI/CustomButton";
import footerImage from "../../assets/img/auth-header.png";
import ArrowRight from "../../assets/img/arrow-right.png";
import DottedLine from "../../assets/img/dotted-line.png";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CartItem from "../../components/UI/CartItem";
import { getOpeningHours } from "../../helpers/time";
import Api from "../../helpers/axios";

export default ({ navigation }) => {
  const cart = useSelector((state) => state.cart);
  const [selectedStore, setSelectedStore] = useState(null);
  const [deliveryType, setDeliveryType] = useState(null);
  const [settings, setSettings] = useState({
    opening_time: "08:00",
    closing_time: "18:30",
    min_order_amount: 3000,
    store_open: 1,
  });

  useEffect(() => {
    AsyncStorage.getItem("selectedStore").then((res) => {
      const selectedStore = JSON.parse(res);
      setSelectedStore(selectedStore);
      getSettings(selectedStore);
    });

    AsyncStorage.getItem("deliveryType").then((res) => {
      setDeliveryType(res);
    });

    const getSettings = async (restaurant) => {
      try {
        const {
          data: { data },
        } = await Api.get(`settings?store_id=${restaurant.id}`);
        setSettings(data);
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

  const goToCheckout = async () => {
    if (+settings.store_open === 0) {
      return alert(
        `The selected store is closed. Please choose another store close to you.`
      );
    }

    if (!isWithinOrderTimeRange()) {
      return alert(
        `You can only order between ${settings.opening_time} and ${settings.closing_time}`
      );
    }

    if (!metMinimumCartRequirement()) {
      return alert(
        `A minimum order of ₦${(+settings.min_order_amount).toLocaleString()} is required before checking out. Current cart's total is ${formattedCartTotal()}`
      );
    }

    const userData = await AsyncStorage.getItem("userData");
    if (!userData) {
      await AsyncStorage.setItem("redirectTo", "checkout");
      return navigation.navigate("SignIn");
    }
    navigation.navigate("Checkout", { selectedStore, deliveryType });
  };

  const formattedCartTotal = () => `₦${cart.totalPrice.toLocaleString()}`;

  const metMinimumCartRequirement = () =>
    cart.totalPrice >= settings.min_order_amount;

  const isWithinOrderTimeRange = () => {
    const { currentTime, openingHour, closingHour } = getOpeningHours(
      settings.opening_time + ":00",
      settings.closing_time + ":00"
    );

    return currentTime >= openingHour && currentTime < closingHour;
  };

  const metRequirements = () =>
    isWithinOrderTimeRange() && metMinimumCartRequirement();

  return (
    <View style={{ height: "100%" }}>
      <ScreenHeader
        hasBackButtonAlt={true}
        hasNavigationDrawerIcon={false}
        hasCartIcon={false}
        title="CART"
        color={Colors.primaryColor}
        navigation={navigation}
      />

      <View style={s.container}>
        <View style={s.cartCard}>
          <FlatList
            style={{ width: "100%", height: "60%" }}
            keyExtractor={(item) => item.id.toString()}
            data={cart?.cart}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <CartItem
                item={item}
                index={index}
                cartLength={cart?.cart?.length}
              />
            )}
          />

          <Image source={DottedLine} style={s.dottedLine} />

          <Image
            source={require("../../assets/img/cart-footer.png")}
            style={s.cartFooter}
          />

          <View style={s.cartTotalContainer}>
            <MyText title="TOTAL" style={s.totalText} />
            <MyText
              title={`₦${(+cart.totalPrice).toLocaleString()}`}
              style={s.totalPriceText}
            />
          </View>
        </View>

        <CustomButton
          style={s.addItemButton}
          textStyle={{ color: Colors.lightGreen }}
          title="Add item"
          onPress={() => navigation.navigate("Home")}
        />

        <CustomButton
          disabled={cart.totalPrice === 0}
          style={{ ...s.checkoutButton, opacity: !metRequirements() ? 0.6 : 1 }}
          textStyle={{ color: "white" }}
          title="checkout"
          onPress={goToCheckout}
        >
          <Image style={s.checkoutIcon} source={ArrowRight} />
        </CustomButton>
      </View>

      <View style={s.footer}>
        <ImageBackground source={footerImage} style={s.footerImage} />
      </View>
    </View>
  );
};

const shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 120,
    paddingHorizontal: 25,
  },
  cartCard: {
    width: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    alignItems: "center",
    marginBottom: 30,
    ...shadow,
  },
  productName: {
    fontFamily: "GilroyBold",
    fontSize: 15,
  },
  productDescription: {
    marginVertical: 2,
    fontFamily: "GilroyLight",
    fontSize: 13,
    color: Colors.grey,
  },
  // pizzaName: {
  //     marginVertical: 2,
  //     fontFamily: 'GilroyLight',
  //     fontSize: 13,
  //     color: Colors.grey
  // },
  productPrice: {
    fontFamily: "GilroyBold",
    fontSize: 15,
    color: Colors.lightGreen,
  },
  dottedLine: {
    width: "100%",
  },
  cartTotalContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  cartFooter: {
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: -5,
  },
  totalText: {
    fontFamily: "GilroyBold",
    fontSize: 17,
  },
  totalPriceText: {
    fontFamily: "GilroyBold",
    fontSize: 17,
    color: Colors.primaryColor,
  },
  addItemButton: {
    borderColor: Colors.lightGreen,
    borderWidth: 1.5,
    marginBottom: 15,
    ...shadow,
  },
  checkoutButton: {
    backgroundColor: Colors.lightGreen,
    ...shadow,
  },
  checkoutIcon: {
    position: "absolute",
    top: 15,
    right: 20,
    width: 24,
    height: 15,
  },
  footer: {
    height: 10,
    backgroundColor: "red",
  },
  footerImage: {
    width: "100%",
    height: "100%",
  },
});
