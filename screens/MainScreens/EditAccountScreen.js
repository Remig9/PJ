import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import MyText from "../../components/UI/MyText";
import Pencil from "../../assets/img/pencil.png";
import * as ImagePicker from "expo-image-picker";

import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../components/UI/Input";
import CustomButton from "../../components/UI/CustomButton";
import Api from "../../helpers/axios";
//   import { storeAuthData } from "../../helpers/authHelper";
import EditProfileIcon from "../../assets/img/edit-profile-icon.png";
import { uploadPhoto } from "../../helpers/fileUpload";
import ProfileImageEmpty from "../../assets/img/profile-empty.png";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({ navigation }) => {
  const token = navigation.getParam("token");

  const [user, setUser] = useState(navigation.getParam("user"));
  const [showNameInput, setShowNameInput] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const PHONE_NO_REGEX = /^[0-9\- ]{8,14}$/;

  const nameSchema = Yup.object().shape({
    name: Yup.string().required(),
  });

  const {
    control: nameControl,
    handleSubmit: nameSubmit,
    errors: nameErrors,
  } = useForm({
    resolver: yupResolver(nameSchema),
  });

  const phoneSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(PHONE_NO_REGEX, { message: "Not a valid phone number" })
      .min(11)
      .required(),
  });

  const {
    control: phoneControl,
    handleSubmit: phoneSubmit,
    errors: phoneErrors,
  } = useForm({
    resolver: yupResolver(phoneSchema),
  });

  const emailSchema = Yup.object().shape({
    customer_emailaddress: Yup.string().email().required(),
  });

  const {
    control: emailControl,
    handleSubmit: emailSubmit,
    errors: emailErrors,
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  const passwordSchema = Yup.object().shape({
    password: Yup.string().required(),
  });

  const {
    control: passwordControl,
    handleSubmit: passwordSubmit,
    errors: passwordErrors,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const hideAllInputs = () => {
    setShowNameInput(false);
    setShowPhoneInput(false);
    setShowEmailInput(false);
    setShowPasswordInput(false);
  };

  const updateAccountHandler = async (data) => {
    setLoading(true);
    try {
      const { data: response } = await Api.put(
        `customers/${user.customer_id}/edit`,
        {
          ...data,
          customer_id: user.customer_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      response.token = token;
      AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          user_data: response.data,
        })
      );
      AsyncStorage.setItem("token", response.token);
      setUser(response.data.user);
      setLoading(false);
      hideAllInputs();
    } catch (e) {
      if (e.response.status === 422) {
        alert("This value already exist");
      }
      setLoading(false);
      console.log(e.response);
    }
  };

  const onChangeImageHandler = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return null;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 0.5,
    });

    if (result.cancelled) {
      return null;
    }

    try {
      const imageResp = await uploadPhoto(result.uri);
      setUser(imageResp.data.user);
      AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          user_data: imageResp.data,
        })
      );
    } catch (e) {
      console.log(e.response.data.message, "update profile pic");
    }
  };

  // console.log(typeof(phoneErrors) != 'undefined' ? phoneErrors.phone.message : phoneErrors)

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <ScreenHeader
        hasNavigationDrawerIcon={false}
        hasBackButtonAlt={true}
        hasCartIcon={false}
        title='ACCOUNT'
        color={Colors.primaryColor}
        navigation={navigation}
      />

      <ScrollView style={s.container} keyboardShouldPersistTaps='always'>
        <View style={s.headerSection}>
          <Pressable onPress={onChangeImageHandler} style={s.imgContainer}>
            <View style={s.profileImgContainer}>
              <ProgressiveImage
                source={
                  user.profile_url
                    ? { uri: user.profile_url }
                    : ProfileImageEmpty
                }
                style={s.profileImage}
              />
            </View>
            <Image source={EditProfileIcon} style={s.editImage} />
          </Pressable>
        </View>

        {!showNameInput && (
          <>
            <TouchableOpacity
              style={s.accountRow}
              onPress={() => {
                hideAllInputs();
                setShowNameInput(true);
              }}
            >
              <View>
                <MyText title='Full Name' h6 style={s.label} />
                <MyText title={user.name} h6 style={s.value} />
              </View>
              <Image style={s.pencilImage} source={Pencil} />
            </TouchableOpacity>
          </>
        )}

        {showNameInput && (
          <View style={s.accountRow}>
            <Controller
              name='name'
              defaultValue={user.name}
              control={nameControl}
              render={({ onChange, value }) => (
                <>
                  <Input
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    style={{
                      width: "75%",
                      paddingVertical: 0,
                      marginRight: 10,
                    }}
                    value={value}
                    placeholder={"First Name"}
                    keyboardType='default'
                    returnKeyType='done'
                    onSubmitEditing={nameSubmit(updateAccountHandler)}
                  />
                </>
              )}
            />

            <View style={s.loginActions}>
              <CustomButton
                style={s.button}
                textStyle={{ color: "white" }}
                title='Change'
                isLoading={loading}
                onPress={nameSubmit(updateAccountHandler)}
              />
            </View>
          </View>
        )}

        {!showPhoneInput && (
          <>
            <TouchableOpacity
              style={s.accountRow}
              onPress={() => {
                hideAllInputs();
                setShowPhoneInput(true);
              }}
            >
              <View>
                <MyText title='Mobile no' style={s.label} />
                <MyText
                  title={user.phone === "110001001100111" ? "" : user.phone}
                  style={s.leftText}
                />
              </View>
              <Image style={s.pencilImage} source={Pencil} />
            </TouchableOpacity>
          </>
        )}

        {showPhoneInput && (
          <View style={s.accountRow}>
            <Controller
              name='phone'
              defaultValue={user.phone === "110001001100111" ? "" : user.phone}
              control={phoneControl}
              render={({ onChange, value }) => (
                <>
                  <Input
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    style={{
                      width: "75%",
                      paddingVertical: 0,
                      marginRight: 10,
                    }}
                    value={value}
                    placeholder={"Mobile No"}
                    keyboardType='number-pad'
                    returnKeyType='done'
                    onSubmitEditing={phoneSubmit(updateAccountHandler)}
                  />
                </>
              )}
            />

            <View style={s.loginActions}>
              <CustomButton
                style={s.button}
                textStyle={{ color: "white" }}
                title='Change'
                isLoading={loading}
                onPress={phoneSubmit(updateAccountHandler)}
              />
            </View>
            {/* {console.log(typeof(phoneErrors.phone))} */}
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {typeof phoneErrors.phone != "undefined" && (
            <MyText
              title={phoneErrors.phone.message}
              style={[s.label, { fontSize: 16 }]}
            />
          )}
        </View>

        {!showEmailInput && (
          <>
            <TouchableOpacity
              style={s.accountRow}
              onPress={() => {
                hideAllInputs();
                setShowEmailInput(true);
              }}
            >
              <View>
                <MyText title='Email address' style={s.label} />
                <MyText title={user.customer_emailaddress} style={s.leftText} />
              </View>
              <Image style={s.pencilImage} source={Pencil} />
            </TouchableOpacity>
          </>
        )}

        {showEmailInput && (
          <View style={s.accountRow}>
            <Controller
              name='customer_emailaddress'
              defaultValue={user.customer_emailaddress}
              control={emailControl}
              render={({ onChange, value }) => (
                <>
                  <Input
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    style={{
                      width: "75%",
                      paddingVertical: 0,
                      marginRight: 10,
                    }}
                    value={value}
                    placeholder={"Email address"}
                    keyboardType='default'
                    returnKeyType='done'
                    onSubmitEditing={emailSubmit(updateAccountHandler)}
                  />
                </>
              )}
            />

            <View style={s.loginActions}>
              <CustomButton
                style={s.button}
                textStyle={{ color: "white" }}
                title='Change'
                isLoading={loading}
                onPress={emailSubmit(updateAccountHandler)}
              />
            </View>
          </View>
        )}

        {!showPasswordInput && (
          <>
            <TouchableOpacity
              style={s.accountRow}
              onPress={() => {
                hideAllInputs();
                setShowPasswordInput(true);
              }}
            >
              <View>
                <MyText title='Password' style={s.label} />
                <MyText title='*********************' style={s.leftText} />
              </View>
              <Image style={s.pencilImage} source={Pencil} />
            </TouchableOpacity>
          </>
        )}

        {showPasswordInput && (
          <View style={s.accountRow}>
            <Controller
              name='password'
              defaultValue={""}
              control={passwordControl}
              render={({ onChange, value }) => (
                <>
                  <Input
                    secureTextEntry={true}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    style={{
                      width: "75%",
                      paddingVertical: 0,
                      marginRight: 10,
                    }}
                    value={value}
                    placeholder={"Password"}
                    keyboardType='default'
                    returnKeyType='done'
                    onSubmitEditing={passwordSubmit(updateAccountHandler)}
                  />
                </>
              )}
            />

            <View style={s.loginActions}>
              <CustomButton
                style={s.button}
                textStyle={{ color: "white" }}
                title='Change'
                isLoading={loading}
                onPress={passwordSubmit(updateAccountHandler)}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    marginTop: 100,
  },
  headerSection: {
    paddingBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    width: 156,
    height: 156,
  },
  profileImgContainer: {
    borderRadius: 156 / 2,
    overflow: "hidden",
  },
  profileImage: {
    width: 156,
    height: 156,
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
  },
  editImage: {
    position: "absolute",
    bottom: 20,
    left: 0,
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.lightGreen,
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
  leftColumn: {},
  label: {
    color: Colors.gold,
    fontFamily: "GilroyBlack",
    fontSize: 13,
    marginBottom: 5,
  },
  leftText: {
    fontFamily: "GilroyRegular",
    fontSize: 17,
  },
  pencilImage: {
    width: 20,
    height: 20,
  },
  loginActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "auto",
    backgroundColor: Colors.primaryColor,
  },
});
