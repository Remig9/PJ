import { View, StyleSheet, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import AuthComponent from "../../components/UI/AuthComponent";
import ControlledInput from "../../components/UI/ControlledInput";
import CustomButton from "../../components/UI/CustomButton";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Colors from "../../constants/Colors";
import MyText from "../../components/UI/MyText";
import Api from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { redirectIntended } from "../../services/authService";

const SignInScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const loginSchema = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(5).max(20),
  });

  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const signInHandler = async (data) => {
    setIsLoading(true);
    setLoginError("");

    const expoToken = await AsyncStorage.getItem("expoToken");

    try {
      const { data: response } = await Api.post("login", {
        ...data,
        expo_token: expoToken,
      });
      // storeAuthData(response);
      AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          user_data: response.data,
        })
      );
      AsyncStorage.setItem("token", response.token);

      setIsLoading(false);
      const redirectTo = await AsyncStorage.getItem("redirectTo");
      if (redirectTo) {
        return redirectIntended(redirectTo, navigation);
      }

      navigation.navigate("Location");
    } catch (e) {
      const errorMessage = e.response.data.message;
      console.log(errorMessage);
      setLoginError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <AuthComponent navigation={navigation} isSignup={false}>
      <View style={s.container}>
        <ControlledInput
          name='email'
          innerRef={emailRef}
          placeholder='Email'
          keyboardType='email-address'
          control={control}
          errorMessage={errors.email?.message}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <ControlledInput
          name='password'
          innerRef={passwordRef}
          placeholder='Password'
          control={control}
          errorMessage={errors.password?.message}
          passwordInput
          onSubmitEditing={handleSubmit(signInHandler)}
        />

        <MyText style={{ color: "red" }} p title={loginError} />

        <View style={s.actions}>
          <CustomButton
            onPress={handleSubmit(signInHandler)}
            style={s.signInButton}
            isLoading={isLoading}
            textStyle={s.signInButtonText}
            title='Sign in'
          />
          <Pressable
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <MyText title='Forgot Password?' h6 />
          </Pressable>
        </View>
      </View>
    </AuthComponent>
  );
};
export default SignInScreen;

const s = StyleSheet.create({
  container: {
    marginTop: 60,
  },
  titleContainer: {
    flexDirection: "row",
  },
  twoColumns: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
  },
  colLeft: {
    marginRight: 10,
  },
  colRight: {
    marginLeft: 10,
  },
  signInButton: {
    backgroundColor: Colors.lightGreen,
    width: "40%",
  },
  signInButtonText: {
    color: "white",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
