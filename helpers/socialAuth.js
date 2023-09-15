// import * as Facebook from "expo-facebook";
import { Platform } from "react-native";
// import * as Google from "expo-google-app-auth";
import Api from "./axios";
import { storeAuthData } from "./authHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { redirectIntended } from "../services/authService";
import * as AppleAuthentication from "expo-apple-authentication";

const defaultPhone = "110001001100111";

export const appleAuthentication = async (navigation, afterLogin, onError) => {
  try {
    const { email, fullName, user } = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const userDetails = {
      email,
      first_name: fullName.givenName,
      last_name: fullName.familyName,
      ios_token: user,
      social_media_type: "apple",
      signup_device: Platform.OS,
    };

    await socialLogin(navigation, userDetails, afterLogin, onError);
  } catch (e) {
    if (e.code === "ERR_CANCELED") {
      onError();
    } else {
      onError();
      console.log(e);
    }
  }
};

// export const facebookAuthentication = async (navigation, afterLogin, onError) => {
//     try {
//         await Facebook.initializeAsync({
//             appId: '998862557553809',
//         });
//         const {
//             type,
//             token,
//             expires,
//             permissions,
//             declinedPermissions,
//         } = await Facebook.logInWithReadPermissionsAsync({
//             permissions: ['public_profile', 'email'],
//         });
//         if (type === 'success') {
//             fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
//                 .then(response => response.json())
//                 .then(data => {
//                     const nameArray = data.name.split(' ');
//                     data.first_name = nameArray[0];
//                     data.last_name = nameArray.length > 1 ? nameArray[1] : nameArray[0];
//                     data.social_media_type = 'facebook';
//                     data.signup_device = Platform.OS;
//                     data.phone = defaultPhone;

//                     socialLogin(navigation, data, afterLogin, onError);
//                 })
//                 .catch(e => console.log(e))
//         } else {
//             // type === 'cancel'
//         }
//     } catch (e) {
//         alert(`Facebook Login Error: ${JSON.stringify(e)}`);
//     }
// }

// export const googleAuthentication = async (navigation, afterLogin, onError) => {
//     const config = {
//         scope: ['profile', 'email'],
//         androidClientId: '452254328584-v356vvgd9fr40gocs0g7l64is1c4rvq8.apps.googleusercontent.com',
//         androidStandaloneAppClientId: '452254328584-jak8had1d50oa3744ofqaob7jv430bi9.apps.googleusercontent.com',
//         iosClientId: '452254328584-aid9a7ialpdpb65ie93rnoqqcshisnjb.apps.googleusercontent.com',
//         iosStandaloneAppClientId: '452254328584-aid9a7ialpdpb65ie93rnoqqcshisnjb.apps.googleusercontent.com'
//     }

//     const {type, accessToken, user} = await Google.logInAsync(config);

//     if (type === 'success') {
//         user.first_name = user.givenName;
//         user.last_name = user.familyName;
//         user.social_media_type = 'google';
//         user.signup_device = Platform.OS;
//         user.phone = defaultPhone;

//         await socialLogin(navigation, user, afterLogin, onError)
//     } else {
//         onError();
//     }
// }

const socialLogin = async (navigation, user, afterLogin, onError) => {
  const expoToken = await AsyncStorage.getItem("expoToken");

  try {
    const { data } = await Api.post("social-login", {
      ...user,
      expo_token: expoToken,
    });
    try {
      storeAuthData(data);
      afterLogin();

      const redirectTo = await AsyncStorage.getItem("redirectTo");
      if (redirectTo) {
        return redirectIntended(redirectTo, navigation);
      }

      navigation.navigate("Location");
    } catch (e) {
      console.log(e);
      onError();
    }
  } catch (e) {
    onError();
    console.log(e);
  }
};
