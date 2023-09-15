import {
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import MyText from "./MyText";
import Colors from "../../constants/Colors";
import * as Google from "expo-auth-session/providers/google";
import AuthHeader from "../../assets/img/auth-header.png";
import Wild from "../../assets/img/wild.png";
import FacebookButton from "./FacebookButton";
import GoogleButton from "./GoogleButton";
import { appleAuthentication } from "../../helpers/socialAuth";
import AppleButton from "./AppleButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../helpers/axios";
import { storeAuthData } from "../../helpers/authHelper";
import { redirectIntended } from "../../services/authService";

const AuthComponent = ({
  children,
  navigation,
  isSignup = true,
  isForgotPassword = false,
  page,
}) => {
  const window = useWindowDimensions();

  const [facebookLoading, setFacebookLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [appleLoading, setAppleLoading] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "452254328584-v356vvgd9fr40gocs0g7l64is1c4rvq8.apps.googleusercontent.com",
    // androidStandaloneAppClientId:
    //   "452254328584-jak8had1d50oa3744ofqaob7jv430bi9.apps.googleusercontent.com",
    iosClientId:
      "452254328584-aid9a7ialpdpb65ie93rnoqqcshisnjb.apps.googleusercontent.com",
    // iosStandaloneAppClientId:
    //   "452254328584-aid9a7ialpdpb65ie93rnoqqcshisnjb.apps.googleusercontent.com",
    expoClientId:
      "452254328584-egsk6907lje5d3j16gmt006oa6fg8ggf.apps.googleusercontent.com",
    // webClientId:
    //   "32011854986-giprcc7tfdb1nv6784qh9udjlgd1mtmg.apps.googleusercontent.com452254328584-hdmfto5hfe40t483ot06c1g21ip6gef3.apps.googleusercontent.com",
  });

  const logIn = () => {
    promptAsync({ useProxy: false, showInRecents: true });
  };

  const getUserData = async (token) => {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    await userInfoResponse.json().then((data) => {
      console.log(data);
      setUserInfo(data);
      socialLogin(data);
    });
  };

  useEffect(() => {
    console.log(response);
    if (response?.type === "success") {
      getUserData(response.authentication.accessToken);

      //   const persistAuth = async () => {
      //     await AsyncStorage.setItem(
      //       "auth",
      //       JSON.stringify(response.authentication)
      //     );
      //   };
      //   persistAuth();
    }
  }, [response]);

  const socialLogin = async (userData) => {
    setGoogleLoading(true);

    const expoToken = await AsyncStorage.getItem("expoToken");
    try {
      const res = await Api.post("social-login", {
        ...{
          first_name: userData.given_name,
          last_name: userData.family_name,
          email: userData.email,
          signup_device: Platform.OS,
          social_media_type: "google",
          expo_token: expoToken,
        },
      });

      //   storeAuthData(data);
      AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          user_data: res.data.data,
        })
      );
      AsyncStorage.setItem("token", res.data.token);
      const redirectTo = await AsyncStorage.getItem("redirectTo");
      setGoogleLoading(false);
      // afterLogin();
      if (redirectTo) {
        return redirectIntended(redirectTo, navigation);
      }

      navigation.navigate("Location");
    } catch (e) {
      // console.log(e.response.data.message);
      console.log(e);
    }
  };

  const appleAuth = async () => {
    setAppleLoading(true);
    await appleAuthentication(
      navigation,
      () => {
        setAppleLoading(false);
      },
      () => {
        setAppleLoading(false);
      }
    );
  };

  // const facebookAuth = async () => {
  //     setFacebookLoading(true);
  //     await facebookAuthentication(
  //         navigation,
  //         () => {
  //             setFacebookLoading(false);
  //         },
  //         () => {
  //             setFacebookLoading(false);
  //         });
  // }

  // const googleAuth = async () => {
  //     setGoogleLoading(true);
  //     await googleAuthentication(
  //         navigation,
  //         () => {
  //             setGoogleLoading(false);
  //         },
  //         () => {
  //             setGoogleLoading(false);
  //         }
  //     )
  // }

  return (
    <View style={{ height: "100%" }}>
      <View style={{ height: (window.height * 6) / 100 }}>
        <ImageBackground source={AuthHeader} style={s.backgroundImage} />
      </View>

      <ScrollView keyboardShouldPersistTaps='always'>
        <View
          style={[s.mainSection, { paddingTop: (window.height * 3) / 100 }]}
        >
          {!isForgotPassword && (
            <MyText
              h1
              style={s.headerText}
              title={isSignup ? "SIGN UP" : "SIGN IN"}
            />
          )}

          {isForgotPassword && (
            <MyText
              h1
              style={s.headerText}
              title={
                page === 1
                  ? "FORGOT PASSWORD"
                  : page === 2
                  ? "OTP VERIFICATION"
                  : "RESET PASSWORD"
              }
            />
          )}

          <View style={{ flexDirection: "row" }}>
            {!isForgotPassword && (
              <>
                <MyText
                  p
                  style={s.headerSubtitle}
                  title={
                    isSignup
                      ? "Already have an account? "
                      : "Don't have an account? "
                  }
                />
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(isSignup ? "SignIn" : "Signup")
                  }
                >
                  <MyText
                    p
                    style={{ ...s.headerSubtitle, color: Colors.gold }}
                    title={isSignup ? "Sign in" : "Sign up"}
                  />
                </TouchableOpacity>
              </>
            )}

            {isForgotPassword && (
              <MyText
                p
                style={s.headerSubtitle}
                title={
                  page === 1
                    ? "A password reset instruction will be sent to the supplied email."
                    : page === 2
                    ? "Enter the otp sent to your email address below."
                    : "Enter your new password"
                }
              />
            )}
          </View>

          {children}
        </View>

        {!isForgotPassword && (
          <View>
            <View style={s.bottomContent}>
              <MyText p style={s.signInWith} title='OR SIGN IN WITH' />

              <View
                style={{
                  flexDirection: Platform.OS === "android" ? "row" : "column",
                  justifyContent:
                    Platform.OS === "android" ? "space-between" : "flex-start",
                  marginBottom: 25,
                }}
              >
                {Platform.OS === "ios" && (
                  <AppleButton
                    title={"Sign in with Apple"}
                    loginIn={appleLoading}
                    onPress={appleAuth}
                  />
                )}

                <View
                  style={
                    Platform.OS === "android" && [
                      s.authButtonContainer,
                      { paddingRight: 10 },
                    ]
                  }
                >
                  <FacebookButton
                    loginIn={facebookLoading}
                    onPress={() => console.log("hi")}
                  />
                </View>

                <View
                  style={
                    Platform.OS === "android" && [
                      s.authButtonContainer,
                      { paddingLeft: 10 },
                    ]
                  }
                >
                  <GoogleButton
                    loginIn={googleLoading}
                    onPress={() => logIn()}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  display: isSignup ? "flex" : "none",
                  alignItems: "center",
                }}
              >
                <MyText
                  p
                  style={s.bottomText}
                  title='By signing up you agree to the '
                />
                <Pressable onPress={() => navigation.navigate("Terms")}>
                  <MyText
                    p
                    style={{
                      ...s.bottomText,
                      color: Colors.gold,
                      textDecorationLine: "underline",
                    }}
                    title='Terms and Conditions'
                  />
                </Pressable>
              </View>
            </View>
            <Image
              source={Wild}
              style={{
                width: 327,
                height: 60,
                marginTop: isSignup ? 0 : 30,
                marginBottom: 30,
              }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AuthComponent;

const s = StyleSheet.create({
  mainSection: {
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "contain",
    alignItems: "center",
  },
  headerText: {
    color: Colors.primaryColor,
  },
  signInWith: {
    marginTop: 20,
    marginBottom: 20,
    color: Colors.grey,
  },
  bottomText: {
    marginTop: "3%",
    marginBottom: 30,
    color: Colors.grey,
  },
  headerSubtitle: {
    marginTop: 10,
    marginBottom: 30,
    color: Colors.grey,
  },
  bottomContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  authButtonContainer: {
    flex: 1,
  },
});
