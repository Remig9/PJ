import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Dimensions, Image, Platform } from "react-native";
import React from "react";

import AuthLoadingScreen from "../screens/AuthScreens/AuthLoadingScreen";
import SignupScreen from "../screens/AuthScreens/SignupScreen";
import SignInScreen from "../screens/AuthScreens/SignInScreen";
import HomeScreen from "../screens/MainScreens/HomeScreen";
import StartScreen from "../screens/StartScreens/StartScreen";
import StoreSelection from "../screens/MainScreens/StoreSelection";
import OrdersScreen from "../screens/MainScreens/OrdersScreen";
import SearchScreen from "../screens/MainScreens/SearchScreen";
import AccountScreen from "../screens/MainScreens/AccountScreen";
import CustomDrawerContentComponent from "../components/UI/CustomDrawerContentComponent";
import Colors from "../constants/Colors";
import DealsMenuScreen from "../screens/MainScreens/DealsMenuScreen";
import PizzaMenuScreen from "../screens/MainScreens/PizzaMenuScreen";
import DrinksMenuScreen from "../screens/MainScreens/DrinksMenuScreen";
import IndividualScreen from "../screens/MainScreens/IndividualScreen";
import TwoSidesIndividualClassicScreen from "../screens/MainScreens/TwoSidesIndividualClassicScreen";
import TwoSidesIndividualSpecialScreen from "../screens/MainScreens/TwoSidesIndividualSpecialScreen";
import SingleDealScreen from "../screens/MainScreens/SingleDealScreen";
import CartScreen from "../screens/MainScreens/CartScreen";
import CheckoutScreen from "../screens/MainScreens/CheckoutScreen";
import PaymentScreen from "../screens/MainScreens/PaymentScreen";
import OrderPlacedScreen from "../screens/MainScreens/OrderPlacedScreen";
import TermsScreen from "../screens/AuthScreens/TermsScreen";
import EditAccountScreen from "../screens/MainScreens/EditAccountScreen";
import ContactUsScreen from "../screens/MainScreens/ContactUsScreen";
import DrinkScreen from "../screens/MainScreens/DrinkScreen";
import AddressesScreen from "../screens/MainScreens/AddressesScreen";
import NotificationScreen from "../screens/MainScreens/NotificationScreen";
import ForgotPasswordScreen from "../screens/AuthScreens/ForgotPasswordScreen";
import TrackOrderScreen from "../screens/MainScreens/TrackOrderScreen";

import HomeIcon from "../assets/img/home.png";
import HomeIconBlur from "../assets/img/home-blur.png";
import SearchIcon from "../assets/img/search.png";
import SearchIconBlur from "../assets/img/search-blur.png";
import OrdersIcon from "../assets/img/orders.png";
import OrdersIconBlur from "../assets/img/orders-blur.png";
import AccountIcon from "../assets/img/account.png";
import AccountIconBlur from "../assets/img/account-blur.png";
import ChatIcon from "../assets/img/chat.png";
import ChatIconBlur from "../assets/img/chat-blur.png";
import SideKicksScreen from "../screens/MainScreens/SideKicksScreen";
import SinglePromoDealScreen from "../screens/MainScreens/SinglePromoDealScreen";

//////Header Configs//////
const authHeaderConfig = () => ({
  header: () => false,
});

const defaultHeaderConfig = () => ({
  header: () => false,
});
//////Header Configs//////

const cartScreens = {
  Cart: {
    screen: CartScreen,
    navigationOptions: defaultHeaderConfig,
  },
  Checkout: {
    screen: CheckoutScreen,
    navigationOptions: defaultHeaderConfig,
  },
  Payment: {
    screen: PaymentScreen,
    navigationOptions: defaultHeaderConfig,
  },
  OrderPlaced: {
    screen: OrderPlacedScreen,
    navigationOptions: defaultHeaderConfig,
  },
  Location: {
    screen: StoreSelection,
    navigationOptions: authHeaderConfig,
  },
};

const DealStack = createStackNavigator({
  Deals: {
    screen: DealsMenuScreen,
    navigationOptions: defaultHeaderConfig,
  },
  SingleDeal: {
    screen: SingleDealScreen,
    navigationOptions: defaultHeaderConfig,
  },
  ...cartScreens,
});

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: defaultHeaderConfig,
  },
  Deals: {
    screen: DealsMenuScreen,
    navigationOptions: defaultHeaderConfig,
  },
  SingleDeal: {
    screen: SingleDealScreen,
    navigationOptions: defaultHeaderConfig,
  },
  SinglePromoDeal: {
    screen: SinglePromoDealScreen,
    navigationOptions: defaultHeaderConfig,
  },
  Pizza: {
    screen: PizzaMenuScreen,
    navigationOptions: defaultHeaderConfig,
  },
  IndividualScreen: {
    screen: IndividualScreen,
    navigationOptions: defaultHeaderConfig,
  },
  SideKicksScreen: {
    screen: SideKicksScreen,
    navigationOptions: defaultHeaderConfig,
  },
  TwoSidesIndividualClassicScreen: {
    screen: TwoSidesIndividualClassicScreen,
    navigationOptions: defaultHeaderConfig,
  },
  TwoSidesIndividualSpecialScreen: {
    screen: TwoSidesIndividualSpecialScreen,
    navigationOptions: defaultHeaderConfig,
  },
  Drinks: {
    screen: DrinksMenuScreen,
    navigationOptions: defaultHeaderConfig,
  },
  Drink: {
    screen: DrinkScreen,
    navigationOptions: defaultHeaderConfig,
  },
  ...cartScreens,
});

const OrdersStack = createStackNavigator({
  Orders: {
    screen: OrdersScreen,
    navigationOptions: defaultHeaderConfig,
  },
  TrackOrder: {
    screen: TrackOrderScreen,
    navigationOptions: defaultHeaderConfig,
  },
  ...cartScreens,
});

const AccountStack = createStackNavigator({
  Account: {
    screen: AccountScreen,
    navigationOptions: defaultHeaderConfig,
  },
  EditAccount: {
    screen: EditAccountScreen,
    navigationOptions: defaultHeaderConfig,
  },
  Addresses: {
    screen: AddressesScreen,
    navigationOptions: defaultHeaderConfig,
  },
  Notification: {
    screen: NotificationScreen,
    navigationOptions: defaultHeaderConfig,
  },
});

const SearchStack = createStackNavigator({
  Search: {
    screen: SearchScreen,
    navigationOptions: defaultHeaderConfig,
  },
  IndividualScreen: {
    screen: IndividualScreen,
    navigationOptions: defaultHeaderConfig,
  },
  ...cartScreens,
});

const HomeAppNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Search: SearchStack,
    Orders: OrdersStack,
    Account: AccountStack,
    Contact: ContactUsScreen,
  },
  {
    initialRouteName: "Home",

    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let icon = HomeIcon;
        const { routeName } = navigation.state;
        if (routeName === "Home") {
          icon = !focused ? HomeIcon : HomeIconBlur;
        } else if (routeName === "Search") {
          icon = !focused ? SearchIcon : SearchIconBlur;
        } else if (routeName === "Orders") {
          icon = !focused ? OrdersIcon : OrdersIconBlur;
        } else if (routeName === "Account") {
          icon = !focused ? AccountIcon : AccountIconBlur;
        } else if (routeName === "Contact") {
          icon = !focused ? ChatIcon : ChatIconBlur;
        }

        return <Image source={icon} style={{ width: 20, height: 20 }} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: "white",
      inactiveTintColor: Colors.gold,
      style: {
        backgroundColor: Colors.primaryColor,
        height:
          Platform.OS === "ios" &&
          (Dimensions.get("window").height > 800 ||
            Dimensions.get("window").width > 800)
            ? 70
            : 65,
        paddingTop: 5,
        paddingBottom:
          Platform.OS === "ios" &&
          (Dimensions.get("window").height > 800 ||
            Dimensions.get("window").width > 800)
            ? 20
            : 5,
      },
      labelStyle: {
        fontFamily: "GilroyBold",
        fontSize: 14,
        marginBottom: 5,
      },
    },
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    Home: HomeAppNavigator,
    // Orders: OrdersStack,
    // Search: SearchStack,
    Account: AccountStack,
    Contact: ContactUsScreen,
  },
  {
    drawerBackgroundColor: Colors.gold,
    initialRouteName: "Home",
    contentComponent: CustomDrawerContentComponent,
    contentOptions: {
      activeTintColor: "#000000",
      activeBackgroundColor: Colors.gold,
      labelStyle: {
        fontSize: 25,
        textTransform: "uppercase",
        fontFamily: "GilroyBold",
        color: Colors.primaryColor,
        fontWeight: "normal",
      },
      activeLabelStyle: {
        color: "white",
      },
      itemStyle: {
        marginLeft: 20,
      },
    },
  }
);

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
    navigationOptions: authHeaderConfig,
  },
  Signup: {
    screen: SignupScreen,
    navigationOptions: authHeaderConfig,
  },
  Terms: {
    screen: TermsScreen,
    navigationOptions: defaultHeaderConfig,
  },
  ForgotPassword: {
    screen: ForgotPasswordScreen,
    navigationOptions: authHeaderConfig,
  },
});

const StartStack = createStackNavigator({
  StartScreen: {
    screen: StartScreen,
    navigationOptions: authHeaderConfig,
  },
});

const LocationStack = createStackNavigator({
  Location: {
    screen: StoreSelection,
    navigationOptions: authHeaderConfig,
  },
});

const NavigationStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: HomeAppNavigator,
    Auth: AuthStack,
    Start: StartStack,
    Location: LocationStack,
  },
  {
    initialRouteName: "AuthLoading",
  }
);

export default createAppContainer(NavigationStack);
