import { View, StyleSheet, TouchableOpacity, Pressable } from "react-native";
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
// import {storeAuthData} from "../../helpers/authHelper";

const ForgotPasswordScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpErrorMessage, setOtpErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [token, setToken] = useState(null);

  const resetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("This field is required")
      .email("Please supply a valid email address"),
  });

  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const otpSchema = Yup.object().shape({
    code: Yup.string().required("This field is required"),
  });

  const {
    control: otpControl,
    handleSubmit: otpSubmit,
    errors: otpError,
  } = useForm({
    resolver: yupResolver(otpSchema),
  });

  const passwordSchema = Yup.object().shape({
    password: Yup.string().required("This field is required").min(5).max(20),
    password_confirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const {
    control: passwordControl,
    handleSubmit: passwordSubmit,
    errors: passwordError,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const password2Ref = useRef(null);

  const resetHandler = async (data) => {
    setIsLoading(true);
    setEmailError("");
    try {
      const { data: response } = await Api.post(
        "password/forgot-password",
        data
      );
      setIsLoading(false);
      if (response.status === 200) {
        setPage(2);
      }
    } catch (e) {
      const errorMessage = e.response.data.message;
      console.log(errorMessage);
      setEmailError(errorMessage);
      setIsLoading(false);
    }
  };

  const verifyOtp = async (data) => {
    setIsLoading(true);
    setOtpErrorMessage("");
    try {
      const { data: response } = await Api.post("password/verify-token", data);
      setIsLoading(false);
      setToken(response.data.token);
      if (response.statusCode === 200) {
        setPage(3);
      }
    } catch (e) {
      const errorMessage = e.response.data.message;
      console.log(errorMessage);
      setOtpErrorMessage(errorMessage);
      setIsLoading(false);
    }
  };

  const changePasswordHandler = async (data) => {
    setIsLoading(true);
    try {
      const { data: response } = await Api.post("password/reset-password", {
        password: data.password,
        code: token,
      });
      setIsLoading(false);
      if (response.statusCode === 200) {
        navigation.navigate("SignIn");
      }
    } catch (e) {
      const errorMessage = e.response.data.message;
      console.log(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <AuthComponent
      navigation={navigation}
      isSignup={false}
      isForgotPassword={true}
      page={page}
    >
      {page === 1 && (
        <View style={s.container}>
          <ControlledInput
            name='email'
            placeholder='Email'
            keyboardType='email-address'
            control={control}
            errorMessage={errors.email?.message}
            returnType='done'
            onSubmitEditing={handleSubmit(resetHandler)}
          />

          <MyText style={{ color: "red" }} p title={emailError} />

          <View style={s.actions}>
            <CustomButton
              onPress={handleSubmit(resetHandler)}
              style={s.signInButton}
              isLoading={isLoading}
              textStyle={s.signInButtonText}
              title='Reset'
            />
            <Pressable onPress={() => navigation.navigate("SignIn")}>
              <MyText title='Sign In?' h6 />
            </Pressable>
          </View>
        </View>
      )}

      {page === 2 && (
        <View style={s.container}>
          <ControlledInput
            name='code'
            placeholder='OTP'
            control={otpControl}
            errorMessage={otpError.otp?.message}
            returnType='done'
            onSubmitEditing={otpSubmit(verifyOtp)}
          />

          <MyText style={{ color: "red" }} p title={otpErrorMessage} />

          <View style={s.actions}>
            <CustomButton
              onPress={otpSubmit(verifyOtp)}
              style={s.signInButton}
              isLoading={isLoading}
              textStyle={s.signInButtonText}
              title='Done'
            />
          </View>
        </View>
      )}

      {page === 3 && (
        <View style={s.container}>
          <ControlledInput
            name='password'
            placeholder='Password'
            control={passwordControl}
            errorMessage={passwordError.password?.message}
            passwordInput
            onSubmitEditing={() => password2Ref.current?.focus()}
          />

          <ControlledInput
            name='password_confirmation'
            innerRef={password2Ref}
            placeholder='Repeat Password'
            control={passwordControl}
            errorMessage={passwordError.password_confirmation?.message}
            passwordInput
            returnType={"done"}
            onSubmitEditing={passwordSubmit(changePasswordHandler)}
          />

          <View style={s.actions}>
            <CustomButton
              onPress={passwordSubmit(changePasswordHandler)}
              style={s.signInButton}
              isLoading={isLoading}
              textStyle={s.signInButtonText}
              title='Reset'
            />
          </View>
        </View>
      )}
    </AuthComponent>
  );
};
export default ForgotPasswordScreen;

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
