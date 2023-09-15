import {
  View,
  StyleSheet,
  useWindowDimensions,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import AuthComponent from "../../components/UI/AuthComponent";
import MyText from "../../components/UI/MyText";
import Colors from "../../constants/Colors";
import ControlledInput from "../../components/UI/ControlledInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import RadioButton from "../../components/UI/RadioButton";
import CustomButton from "../../components/UI/CustomButton";
import DateTimePicker from "react-native-modal-datetime-picker";
import Input from "../../components/UI/Input";
import Api from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { redirectIntended } from "../../services/authService";

const SignupScreen = ({ navigation }) => {
  const window = useWindowDimensions();
  const [title, setTitle] = useState("Mr");
  const [birthOpts, setBirthOpts] = useState({
    show: false,
    value: "",
    mode: "date",
    displayFormat: "DD-MM-YYYY",
    label: "Date",
  });
  const [birthDate, setBirthDate] = useState("");
  const [birthDayError, setBirthDayError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});

  const showDateTimePicker = () => {
    const newBirthOpts = { ...birthOpts, show: true };
    setBirthOpts(newBirthOpts);
    Keyboard.dismiss();
  };

  const hideDateTimePicker = () => {
    const newBirthOpts = { ...birthOpts, show: false };
    setBirthOpts(newBirthOpts);
  };

  const handleDatePicked = (value) => {
    setBirthDayError("");
    let date = new Date(value);
    date =
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "-" +
      date.getFullYear();
    setBirthDate(date);

    setTimeout(() => {
      hideDateTimePicker();
    }, 250);

    setTimeout(() => {
      emailRef.current?.focus();
    }, 700);
  };

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const submitBtn = useRef(null);

  const loginSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    // last_name: Yup.string().required("This field is required"),
    email: Yup.string().required("This field is required").email(),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(
        /^([0]{1}|\+?[234]{3})([7-9]{1})([0|1]{1})([\d]{1})([\d]{7})$/g,
        "Invalid phone number"
      ),
    password: Yup.string().required("This field is required").min(5).max(20),
    password_confirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const inputMarginVertical =
    window.height > 750 ? 15 : (window.height * 0.5) / 100;

  const signupHandler = async (data) => {
    if (!birthDate) {
      return setBirthDayError("This field is required!");
    }
    const expoToken = await AsyncStorage.getItem("expoToken");
    setIsLoading(true);
    data.dob = birthDate;
    data.expo_token = expoToken;

    try {
      const { data: response } = await Api.post("register", data);
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
      setRegisterErrors(e.response.data?.errors);
      console.log(e.response.data);
      setIsLoading(false);
    }
  };
  return (
    <AuthComponent navigation={navigation}>
      <DateTimePicker
        date={birthOpts.value ? new Date(birthOpts.value) : new Date()}
        isVisible={birthOpts.show}
        mode={birthOpts.mode}
        onConfirm={handleDatePicked}
        onCancel={hideDateTimePicker}
      />
      <View>
        <View style={s.titleContainer}>
          <RadioButton
            onPress={() => setTitle("Mr")}
            checked={title === "Mr" ? "checked" : "unchecked"}
            radioKey='Mr'
            value='Mr'
            title='Mr'
          />

          <RadioButton
            onPress={() => setTitle("Miss")}
            checked={title === "Miss" ? "checked" : "unchecked"}
            radioKey='Miss'
            value='Miss'
            title='Miss'
          />

          <RadioButton
            onPress={() => setTitle("Mrs")}
            checked={title === "Mrs" ? "checked" : "unchecked"}
            radioKey='Mrs'
            value='Mrs'
            title='Mrs'
          />
        </View>

        <View style={[s.twoColumns]}>
          <View style={{ ...s.col, ...s.colLeft }}>
            <ControlledInput
              name='name'
              placeholder='Full Name'
              control={control}
              errorMessage={errors.name?.message}
              style={{ marginVertical: inputMarginVertical }}
              onSubmitEditing={() => showDateTimePicker()}
            />
          </View>

          {/*<View style={{...s.col}}>*/}
          {/*    <ControlledInput*/}
          {/*        name="last_name"*/}
          {/*        innerRef={lastNameRef}*/}
          {/*        placeholder="Last Name"*/}
          {/*        control={control}*/}
          {/*        errorMessage={errors.last_name?.message}*/}
          {/*        style={{marginVertical: inputMarginVertical}}*/}
          {/*        onSubmitEditing={() => showDateTimePicker()}*/}
          {/*    />*/}
          {/*</View>*/}

          <View style={{ ...s.col, ...s.colRight }}>
            <Input
              defaultValue={birthDate}
              style={{ marginVertical: inputMarginVertical }}
              editable={false}
              placeholder='Birthday'
            />
            <MyText style={{ color: "red" }} p title={birthDayError} />

            <Pressable
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                top: inputMarginVertical,
                bottom: inputMarginVertical,
                left: 0,
                right: 0,
              }}
              onPress={() => showDateTimePicker()}
            />
          </View>
        </View>

        <View style={s.twoColumns}>
          <View style={{ ...s.col, ...s.colLeft }}>
            <ControlledInput
              name='email'
              innerRef={emailRef}
              placeholder='Email'
              keyboardType='email-address'
              control={control}
              errorMessage={errors.email?.message || registerErrors?.email}
              style={{ marginVertical: inputMarginVertical }}
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
          </View>

          <View style={{ ...s.col, ...s.colRight }}>
            <ControlledInput
              name='phone'
              innerRef={phoneRef}
              placeholder='Mobile No'
              control={control}
              keyboardType='number-pad'
              errorMessage={errors.phone?.message || registerErrors?.phone}
              style={{ marginVertical: inputMarginVertical }}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>
        </View>

        <View>
          <ControlledInput
            name='password'
            innerRef={passwordRef}
            placeholder='Password'
            control={control}
            errorMessage={errors.password?.message}
            passwordInput
            style={{ marginVertical: inputMarginVertical }}
            onSubmitEditing={() => password2Ref.current?.focus()}
          />
        </View>

        <View>
          <ControlledInput
            name='password_confirmation'
            innerRef={password2Ref}
            placeholder='Repeat Password'
            control={control}
            errorMessage={errors.password_confirmation?.message}
            passwordInput
            style={{ marginVertical: inputMarginVertical }}
            returnType={"done"}
            onSubmitEditing={handleSubmit(signupHandler)}
          />
        </View>

        <View style={{ width: "40%" }}>
          <CustomButton
            innerRef={submitBtn}
            onPress={handleSubmit(signupHandler)}
            style={s.signupButton}
            isLoading={isLoading}
            textStyle={s.signupButtonText}
            title='Sign up'
          />
        </View>
      </View>
    </AuthComponent>
  );
};

export default SignupScreen;

const s = StyleSheet.create({
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
  signupButton: {
    backgroundColor: Colors.lightGreen,
  },
  signupButtonText: {
    color: "white",
  },
});
