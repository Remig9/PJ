import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { combineReducers, createStore } from "redux";
import { Provider, useDispatch } from "react-redux";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import Navigation from "./navigation/Navigation";
import cart from "./store/reducers/cart";
import { initCart } from "./store/actions/cart";
import { initTables, syncAddress, syncCart } from "./db/databaseTransactions";
import address from "./store/reducers/address";
import { initAddress } from "./store/actions/address";
import { Button, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "./helpers/axios";
// import { storeAuthData } from "./helpers/authHelper";
// import Pusher from 'pusher-js/react-native';

if (Platform.OS === "android") {
  require("intl");
  require("intl/locale-data/jsonp/en-IN");
}

//////Font Imports///////
import GilroyRegular from "./assets/fonts/Gilroy-Regular.ttf";
import GilroyLight from "./assets/fonts/Gilroy-Light.ttf";
import GilroySemiBold from "./assets/fonts/Gilroy-SemiBold.ttf";
import GilroyBlack from "./assets/fonts/Gilroy-Black.ttf";
import GilroyBlackItalic from "./assets/fonts/Gilroy-BlackItalic.ttf";
import GilroyBold from "./assets/fonts/Gilroy-Bold.ttf";
import GilroyMedium from "./assets/fonts/Gilroy-Medium.ttf";
import UbuntuRegular from "./assets/fonts/Ubuntu-Regular.ttf";
//////Font Imports///////

//////Image Imports//////
import StartScreenBackground from "./assets/img/start-screen.png";
import StartScreen2Background from "./assets/img/start-screen2.png";
import Logo from "./assets/img/logo.png";
import AuthHeader from "./assets/img/auth-header.png";
import Wild from "./assets/img/wild.png";
import WildGreen from "./assets/img/wild-green.png";
import FacebookIcon from "./assets/img/facebook.png";
import GoogleIcon from "./assets/img/google.png";
import DropDownIcon from "./assets/img/drop-down.png";
import DrawerIcon from "./assets/img/drawer-icon.png";
import CartIcon from "./assets/img/cart-icon.png";
import DealsImage from "./assets/img/deals.png";
import DrinksImage from "./assets/img/drinks.png";
import CloseIcon from "./assets/img/close-icon.png";
import PizzaJungle from "./assets/img/pizza-jungle.png";
import PizzaJungleRed from "./assets/img/pjungle-red.png";
import PizzaImageActive from "./assets/img/pizza-size-image-active.png";
import PizzaImageInactive from "./assets/img/pizza-size-image-inactive.png";
import CheckIcon from "./assets/img/check-icon.png";
import CheckCartIcon from "./assets/img/check-cart.png";
import GoBackIcon from "./assets/img/go-back.png";
import RemoveIcon from "./assets/img/remove.png";
import ArrowRight from "./assets/img/arrow-right.png";
import DottedLine from "./assets/img/dotted-line.png";
import Pencil from "./assets/img/pencil.png";
import RedDot from "./assets/img/red-dot.png";
import GreyDot from "./assets/img/grey-dot.png";
import ProfileImageEmpty from "./assets/img/profile-empty.png";
import PlusIcon from "./assets/img/plus.png";
import MinusIcon from "./assets/img/minus.png";
import HomeIcon from "./assets/img/home.png";
import HomeBlur from "./assets/img/home-blur.png";
import SearchIcon from "./assets/img/search.png";
import SearchIconBlur from "./assets/img/search-blur.png";
import OrdersIcon from "./assets/img/orders.png";
import OrdersIconBlur from "./assets/img/orders-blur.png";
import AccountIcon from "./assets/img/account.png";
import AccountIconBlur from "./assets/img/account-blur.png";
import ChatIcon from "./assets/img/chat.png";
import ChatIconBlur from "./assets/img/chat-blur.png";
import NewTag from "./assets/img/new-tag.png";
import PJIcon from "./assets/icon.png";
import { OtaUpdater } from "./components/UI/OtaUpdater";
import { Ota } from "./components/UI/Ota";
import * as ImagePicker from "expo-image-picker";
import Ratings from "./components/UI/Ratings";
import "expo-dev-client";

//////Image Imports//////

/////Load Assets Async/////
const loadResourcesAsync = () => {
  return Promise.all([
    Asset.loadAsync([
      HomeIcon,
      HomeBlur,
      SearchIcon,
      SearchIconBlur,
      OrdersIcon,
      OrdersIconBlur,
      AccountIconBlur,
      AccountIcon,
      ChatIconBlur,
      ChatIcon,
      StartScreenBackground,
      StartScreen2Background,
      Logo,
      AuthHeader,
      Wild,
      WildGreen,
      FacebookIcon,
      GoogleIcon,
      DropDownIcon,
      DrawerIcon,
      CartIcon,
      DealsImage,
      DrinksImage,
      CloseIcon,
      PizzaJungle,
      PizzaJungleRed,
      PizzaImageActive,
      PizzaImageInactive,
      CheckIcon,
      CheckCartIcon,
      GoBackIcon,
      RemoveIcon,
      ArrowRight,
      DottedLine,
      Pencil,
      RedDot,
      GreyDot,
      ProfileImageEmpty,
      PlusIcon,
      MinusIcon,
      PJIcon,
      NewTag,
    ]),

    Font.loadAsync({
      GilroyRegular,
      GilroyLight,
      GilroySemiBold,
      GilroyBlack,
      GilroyBlackItalic,
      GilroyBold,
      GilroyMedium,
      UbuntuRegular,
    }),
  ]);
};
/////Load Assets Async/////

/////Reducers/////
const reducers = combineReducers({
  cart: cart,
  address: address,
});
/////Reducers/////

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const requestPermissions = async () => {
  await ImagePicker.requestCameraPermissionsAsync();
};

const initPusher = (dispatch) => {
  // Pusher.logToConsole = false;
  // const pusher = new Pusher('app_key', {
  //     cluster: 'eu',
  //     forceTLS: true
  // });
  //
  // const productChannel = pusher.subscribe('new-push-notification');
  //
  // productChannel.bind('App\\Events\\ProductChanged', eventData => {
  //     dispatch(productUpdated());
  // });
};

const AppWrapper = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState("");
  const dispatch = useDispatch();
  initTables();
  syncCart((data) => dispatch(initCart(data)));
  syncAddress((data) => dispatch(initAddress(data)));
  const notificationListener = useRef();
  const responseListener = useRef();
  //   initPusher(dispatch);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    requestPermissions();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log({ notification });
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log({ response });
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;

      AsyncStorage.setItem("expoToken", token);

      updateExpoToken(token);
    } else {
      // alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  const updateExpoToken = async (token) => {
    let user = await AsyncStorage.getItem("userData");

    if (user && user != {}) {
      user = JSON.parse(user).user_data.user;
      if (!user) {
        await AsyncStorage.clear();
      }
      if (!user.expo_token) {
        const { data: response } = await Api.post(
          `customers/${user.customer_id}/update-expo-token`,
          { expo_token: token }
        );
        AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            user_data: response.data.data,
          })
        );
        // storeAuthData(response, false);
      }
    }
  };

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={(error) => console.log(error, "font error")}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }

  return (
    <>
      <Navigation />
      <Ratings />
    </>
  );
};

const App = () => {
  const store = createStore(reducers);

  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <AppWrapper />
      {Platform.OS !== "web" && <Ota />}
    </Provider>
  );
};

export default App;
