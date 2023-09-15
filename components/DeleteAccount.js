import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Modal } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../helpers/axios";
import CustomButton from "./UI/CustomButton";
import { redirectIntended } from "../services/authService";
import MyText from "./UI/MyText";

const DeleteAccount = ({
  openModal,
  setOpenModal,
  user,
  token,
  navigation,
}) => {
  const [isDeleting, setIsDeleting] = useState();

  console.log(user);

  console.log(token);

  const handleDelete = async () => {
    setIsDeleting(true);
    AsyncStorage.setItem("deleteuser", JSON.stringify({ email: user.email }));

    try {
      const data = await Api.del(`/delete-account/${user.id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsDeleting(false);
      setOpenModal(false);

      AsyncStorage.removeItem("userData");
      AsyncStorage.removeItem("token");

      console.log(data.response);

      const redirectTo = await AsyncStorage.getItem("redirectTo");

      // afterLogin();
      if (redirectTo) {
        return redirectIntended(redirectTo, navigation);
      }

      navigation.navigate("Location");
    } catch (e) {
      AsyncStorage.setItem("deleteuser", JSON.stringify({ email: user.email }));
      setIsDeleting(false);
      console.log(e);
      setOpenModal(false);
      AsyncStorage.removeItem("userData");
      AsyncStorage.removeItem("token");

      const redirectTo = await AsyncStorage.getItem("redirectTo");

      // afterLogin();
      if (redirectTo) {
        return redirectIntended(redirectTo, navigation);
      }

      navigation.navigate("Location");
    }
  };
  return (
    <>
      <Modal
        statusBarTranslucent={true}
        animationType='slide'
        transparent={true}
        presentationStyle='overFullScreen'
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(!openModal);
        }}
      >
        <View style={style.container}>
          <View style={style.updateContainer}>
            <MyText title='Are you sure you want to delete account' h6 />
            <CustomButton
              style={style.promoBtn}
              title='Delete account'
              isLoading={isDeleting}
              textStyle={style.promoBtnText}
              onPress={() => handleDelete()}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DeleteAccount;

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .3)",
  },
  updateContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E7E7E9",
    borderRadius: 5,
    width: "85%",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  promoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
  },
  promoBtnText: {
    fontSize: 11,
  },
});
