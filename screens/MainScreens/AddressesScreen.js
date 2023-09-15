import {
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import footerImage from "../../assets/img/auth-header.png";
import MyText from "../../components/UI/MyText";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/UI/CustomButton";
import Api from "../../helpers/axios";
import { syncAddress } from "../../db/databaseTransactions";
import { initAddress } from "../../store/actions/address";
import ControlledInput from "../../components/UI/ControlledInput";
import MapInput from "../../components/UI/MapInput";
import CheckoutModal from "../../components/UI/CheckoutModal";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addNewAddress } from "../../services/addressService";

const AddressesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const addressesStore = useSelector((state) => state.address).addresses;
  const user = navigation.getParam("user");

  const [refreshing, setRefreshing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(null);
  const [selectedAddressEdit, setSelectedAddressEdit] = useState({});
  const [newAddress, setNewAddress] = useState(null);

  const deliveryHouseNumber = useRef(null);
  const deliveryAddress = useRef(null);

  const address = Yup.object().shape({
    delivery_phone: Yup.string().required(),
  });

  const { control: addressControl, handleSubmit: handleAddressSubmit } =
    useForm({
      resolver: yupResolver(address),
    });

  const onRefresh = () => {
    setRefreshing(true);
    syncAddress((data) => dispatch(initAddress(data))).then(() => {
      setRefreshing(false);
    });
  };

  const onCloseAddressModalHandler = () => {
    setIsAddingAddress(false);
    setShowAddAddress(null);
    setAddressModalVisible(false);
  };

  const showModalHandler = (address, edit = true) => {
    if (edit) {
      setSelectedAddressEdit(address);
      setNewAddress(address);
    }
    setShowAddAddress(edit ? "Edit" : "Add");
    setAddressModalVisible(true);
  };

  const storeNewAddress = (loc) => {
    const newAddress = {
      address: loc.formatted_address,
      longitude: loc.geometry.location.lng,
      latitude: loc.geometry.location.lat,
      default: 1,
    };

    setNewAddress(newAddress);
  };

  const addAddressHandler = async (data) => {
    setIsAddingAddress(true);
    try {
      if (showAddAddress === "Add") {
        const address = { ...data, ...newAddress };
        const {
          data: {
            data: { delivery_address_id: addressId },
          },
        } = await Api.post(`customers/${user.customer_id}/delivery-address`, {
          ...address,
          customer_id: user.customer_id,
        });
        address.id = addressId;
        await addNewAddress(address);
      } else if (showAddAddress === "Edit") {
        newAddress.delivery_phone = data.delivery_phone;
        newAddress.house_number = data.house_number;

        await Api.put(
          `customers/${user.customer_id}/delivery-address/${selectedAddressEdit.id}`,
          {
            ...newAddress,
            customer_id: user.customer_id,
          }
        );
      }
      syncAddress((data) => dispatch(initAddress(data)));
      setIsAddingAddress(false);
      setShowAddAddress(null);
      setAddressModalVisible(false);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteAddress = async (address) => {
    setIsDeleting(address.id);
    try {
      await Api.delete(
        `customers/${user.customer_id}/delivery-address/${address.id}`
      );
      await syncAddress((data) => dispatch(initAddress(data)));
      setIsDeleting(null);
    } catch (e) {
      console.log(e);
      setIsDeleting(null);
    }
  };

  const Address = ({ address }) => (
    <View style={s.address}>
      <MyText
        style={s.addressText}
        title={
          address.house_number
            ? `${address.house_number}, ${address.address}`
            : address.address
        }
      />

      <View style={s.buttonRow}>
        <CustomButton
          isLoading={isDeleting === address.id}
          style={s.deleteAddressBtn}
          textStyle={s.addressButtonsText}
          onPress={() => deleteAddress(address)}
          title="Delete Address"
        />
        <CustomButton
          style={s.repeatOrderBtn}
          onPress={() => showModalHandler(address)}
          textStyle={s.addressButtonsText}
          title="Edit Address"
        />
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={s.headerComponentStyle}>
            <CustomButton
              style={s.addAddressBtn}
              onPress={() => showModalHandler({}, false)}
              textStyle={s.addAddressBtnText}
              title="Add Address"
            />
          </View>
        }
        style={s.flatListContainer}
        contentContainerStyle={s.list}
        keyExtractor={(item) => item.id.toString()}
        data={addressesStore}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <Address address={item} />}
      />

      <CheckoutModal
        modalVisible={addressModalVisible}
        doneHandler={
          showAddAddress
            ? handleAddressSubmit(addAddressHandler)
            : () => setAddressModalVisible(false)
        }
        title="Delivery Address"
        buttonText={showAddAddress === "Edit" ? "Update" : "Add"}
        btnIsLoading={isAddingAddress}
        closeBtnText={showAddAddress ? "Close" : null}
        onCloseHandler={onCloseAddressModalHandler}
      >
        <ScrollView keyboardShouldPersistTaps="always" style={s.modalContainer}>
          <ControlledInput
            control={addressControl}
            style={{ color: "red" }}
            defaultValue={
              showAddAddress === "Edit"
                ? selectedAddressEdit.delivery_phone
                : ""
            }
            placeholder="Phone number"
            name="delivery_phone"
            onSubmitEditing={() => deliveryHouseNumber.current?.focus()}
          />

          <ControlledInput
            innerRef={deliveryHouseNumber}
            control={addressControl}
            keyboardType="numeric"
            defaultValue={
              showAddAddress === "Edit" ? selectedAddressEdit.house_number : ""
            }
            placeholder="House number"
            name="house_number"
            onSubmitEditing={() => deliveryAddress.current?.focus()}
          />

          <View style={s.mapInputContainer}>
            <MapInput
              innerRef={deliveryAddress}
              notifyChange={storeNewAddress}
              defaultValue={
                showAddAddress === "Edit" ? selectedAddressEdit.address : ""
              }
              onSubmitEditing={() => {}}
            />
          </View>
        </ScrollView>
      </CheckoutModal>

      <ScreenHeader
        hasNavigationDrawerIcon={false}
        hasBackButtonAlt={true}
        hasCartIcon={false}
        title="ADDRESSES"
        color={Colors.primaryColor}
        navigation={navigation}
      />

      <View style={s.footer}>
        <ImageBackground source={footerImage} style={s.footerImage} />
      </View>
    </>
  );
};

export default AddressesScreen;

const s = StyleSheet.create({
  list: {
    marginTop: 150,
    paddingHorizontal: 30,
    paddingBottom: 200,
  },
  address: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  addressText: {
    fontFamily: "GilroyBlack",
    color: Colors.gold,
    marginVertical: 2,
  },
  footer: {
    height: 10,
    backgroundColor: "red",
  },
  footerImage: {
    width: "100%",
    height: "100%",
  },
  headerComponentStyle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  addAddressBtn: {
    backgroundColor: Colors.lightGreen,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "auto",
  },
  addAddressBtnText: {
    fontSize: 14,
    color: "white",
  },
  buttonRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteAddressBtn: {
    flex: 1,
    backgroundColor: Colors.checkoutGreen,
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginRight: 7,
  },
  addressButtonsText: {
    fontSize: 14,
    color: "white",
  },
  repeatOrderBtn: {
    // width: '50%',
    flex: 1,
    backgroundColor: Colors.lightGreen,
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginLeft: 7,
  },
});
