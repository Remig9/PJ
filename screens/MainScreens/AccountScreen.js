import {
  ImageBackground,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import MyText from "../../components/UI/MyText";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import footerImage from "../../assets/img/auth-header.png";
import CustomButton from "../../components/UI/CustomButton";
import { useDispatch } from "react-redux";
import { logout } from "../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationEvents } from "react-navigation";
import Api from "../../helpers/axios";
import RedDot from "../../assets/img/red-dot.png";
import ProfileImageEmpty from "../../assets/img/profile-empty.png";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import DeleteAccount from "../../components/DeleteAccount";

export default ({ navigation }) => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [unusedBalance, setUnusedBalance] = useState(0);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  //   const [userInfo, setUserInfo] = useState({});

  const getUnusedBalance = async (user) => {
    try {
      let { data } = await Api.get(`get-unused-balance/${user.customer_id}`);
      setUnusedBalance(data);
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const getObjects = async () => {
    const userData = await AsyncStorage.getItem("userData");
    const jsonValue = JSON.parse(userData);
    if (!jsonValue) {
      return setIsAuthenticated(false);
    }
    const user = jsonValue.user_data.user;
    setUser(user);

    const token = await AsyncStorage.getItem("token");
    setToken(token);

    getUnusedBalance(user);

    try {
      const { data } = await Api.get(`notifications/${user.customer_id}`);
      setNotifications(data);

      const hasUnreadNotifications = !!data.find(
        (notification) => !notification.read_at
      );

      setHasUnreadNotifications(hasUnreadNotifications);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getObjects();
  }, []);

  const signOutHandler = async () => {
    await logout(dispatch);

    AsyncStorage.removeItem("userData");
    AsyncStorage.removeItem("token");

    navigation.navigate("Home");
  };

  console.log(user);
  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <DeleteAccount
        openModal={openModal}
        setOpenModal={setOpenModal}
        user={user}
        token={token}
        navigation={navigation}
      />
      <ScreenHeader
        hasCartIcon={false}
        title='ACCOUNT'
        color={Colors.primaryColor}
        navigation={navigation}
      />

      <ScrollView style={s.container}>
        <NavigationEvents onWillFocus={() => getObjects()} />
        <View style={s.headerSection}>
          <ProgressiveImage
            source={
              user.profile_url ? { uri: user.profile_url } : ProfileImageEmpty
            }
            style={s.image}
          />
        </View>

        {isAuthenticated && (
          <>
            <View style={s.accountRow}>
              <MyText title={user.name} style={s.fullName} />

              <View style={s.rightColumn}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("EditAccount", { user, token })
                  }
                  style={s.link}
                >
                  <MyText title='Edit account' style={s.linkText} />
                </Pressable>
                <MyText
                  title={user.phone === "110001001100111" ? "" : user.phone}
                  style={s.phoneNumber}
                />
              </View>
            </View>

            <Pressable
              onPress={() => navigation.navigate("Addresses", { user, token })}
              style={s.accountRow}
            >
              <MyText title='Delivery Address' style={s.leftText} />
            </Pressable>

            <View style={s.accountRow}>
              <MyText title='Balance' style={s.leftText} />
              <MyText
                title={`₦${
                  !unusedBalance
                    ? 0
                    : unusedBalance > 0
                    ? Math.trunc(unusedBalance).toLocaleString()
                    : 0
                }`}
                style={[s.leftText, s.balance]}
              />
            </View>

            <Pressable
              onPress={() =>
                navigation.navigate("Notification", { notifications, user })
              }
              style={s.accountRow}
            >
              <MyText title='Notifications' style={s.leftText} />
              {hasUnreadNotifications && (
                <Image style={s.readImage} source={RedDot} />
              )}
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Location")}
              style={s.accountRow}
            >
              <MyText title='Change Restaurant' style={s.leftText} />
            </Pressable>
            <Pressable onPress={() => setOpenModal(true)} style={s.accountRow}>
              <MyText title='Delete Account' style={s.leftText} />
            </Pressable>

            <View style={[s.accountRow, s.buttonContainer]}>
              <CustomButton
                onPress={signOutHandler}
                style={s.signOutBtn}
                textStyle={s.signOutText}
                title='sign out'
              />
            </View>
          </>
        )}

        {!isAuthenticated && (
          <View style={s.loginBtnContainer}>
            <CustomButton
              title='Login To Continue'
              onPress={async () => {
                await AsyncStorage.setItem("redirectTo", "profile");
                return navigation.navigate("SignIn");
              }}
              style={s.loginBtn}
              textStyle={s.signOutText}
            />
          </View>
        )}
      </ScrollView>

      <View style={s.footer}>
        <ImageBackground source={footerImage} style={s.footerImage} />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    marginTop: 100,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 156,
    height: 156,
  },
  headerSection: {
    paddingBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 180,
    height: 180,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    borderRadius: 180 / 2,
    // elevation: 4
  },
  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 40,
    borderBottomWidth: 0.5,
    borderColor: "#707070",
    paddingVertical: 25,
  },
  fullName: {
    color: Colors.primaryColor,
    fontFamily: "GilroyBlack",
    fontSize: 19,
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  link: {
    marginVertical: 4,
  },
  linkText: {
    color: Colors.gold,
    fontFamily: "GilroyLight",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  phoneNumber: {
    color: Colors.primaryColor,
    fontFamily: "GilroyRegular",
    fontSize: 18,
    marginTop: 4,
  },
  leftText: {
    fontFamily: "GilroyRegular",
    fontSize: 17,
  },
  balance: {
    color: Colors.primaryColor,
  },
  pencilImage: {
    width: 20,
    height: 20,
  },
  buttonContainer: {
    borderColor: "transparent",
    justifyContent: "flex-start",
    width: "50%",
  },
  signOutBtn: {
    backgroundColor: Colors.lightGreen,
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  signOutText: {
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
  readImage: {
    width: 10,
    height: 10,
  },
  getStarted: {
    marginTop: 10,
  },
  loginBtnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 200,
    width: "100%",
  },
  loginBtn: {
    backgroundColor: Colors.lightGreen,
    paddingVertical: 10,
    paddingHorizontal: 0,
    width: "50%",
  },
});
