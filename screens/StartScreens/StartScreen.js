import { View, ImageBackground, StyleSheet, Image } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import StartScreenBackground from "../../assets/img/start-screen.png";
import StartScreen2Background from "../../assets/img/start-screen2.png";
import Logo from "../../assets/img/logo.png";
import CustomButton from "../../components/UI/CustomButton";
import Colors from "../../constants/Colors";

const StartScreen1 = ({ navigation }) => {
  const goTo = async (page) => {
    await AsyncStorage.setItem("@hasSeenTutorial", "true");
    navigation.navigate(page);
  };

  return (
    <View style={s.container}>
      <View style={s.sectionTop}>
        <ImageBackground
          source={StartScreenBackground}
          style={s.backgroundImage}
        >
          <Image source={Logo} style={s.image} />
        </ImageBackground>
      </View>

      <View style={s.sectionBottom}>
        <ImageBackground
          source={StartScreen2Background}
          style={{ ...s.backgroundImage, ...s.bottomBackground }}
        >
          <CustomButton
            style={s.authButton}
            textStyle={s.authButtonText}
            title="Sign In"
            onPress={() => goTo("SignIn")}
          />
          <CustomButton
            style={s.authButton}
            textStyle={s.authButtonText}
            title="Sign up"
            onPress={() => goTo("Signup")}
          />
          {/* <CustomButton
            style={s.authButton}
            textStyle={s.authButtonText}
            title="Just order"
            onPress={() => goTo("AuthLoading")}
          /> */}
        </ImageBackground>
      </View>
    </View>
  );
};

export default StartScreen1;

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
  },
  bottomBackground: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 60,
  },
  sectionTop: {
    flex: 7,
  },
  sectionBottom: {
    flex: 4,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: "15%",
  },
  authButton: {
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authButtonText: {
    fontSize: 17,
    color: Colors.primaryColor,
  },
});
