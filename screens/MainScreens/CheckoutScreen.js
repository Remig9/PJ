import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "../../constants/Colors";
import ScreenHeader from "../../components/UI/ScreenHeader";
import MyText from "../../components/UI/MyText";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledInput from "../../components/UI/ControlledInput";
import CustomButton from "../../components/UI/CustomButton";
import footerImage from "../../assets/img/auth-header.png";
import { useDispatch, useSelector } from "react-redux";
import { firstCharacter, truncateString } from "../../services/typography";
import CheckoutModal from "../../components/UI/CheckoutModal";
import MapInput from "../../components/UI/MapInput";
import { addNewAddress, updateAddress } from "../../services/addressService";
import {
  addAddress,
  initAddress,
  updateStoreAddress,
} from "../../store/actions/address";
import Api from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { syncAddress } from "../../db/databaseTransactions";
import Input from "../../components/UI/Input";
import { Controller, useForm } from "react-hook-form";
import { RadioButton } from "react-native-paper";

export default ({ navigation }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const addressesStore = useSelector((state) => state.address).addresses;
  const selectedStore = navigation.getParam("selectedStore");

  const [deliveryType, setDeliveryType] = useState(
    navigation.getParam("deliveryType")
  );
  const [addresses, setAddresses] = useState(addressesStore);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(null);
  const [selectedAddressEdit, setSelectedAddressEdit] = useState({});
  const [newAddress, setNewAddress] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const [loadingDeliveryFee, setLoadingDeliveryFee] = useState(true);
  const [reRender, setReRender] = useState(0);
  const [verifyingPromoCode, setVerifyingPromoCode] = useState(false);
  const [couponMessage, setCouponMessage] = useState(null);
  const [couponAmount, setCouponAmount] = useState(0);
  const [couponID, setCouponID] = useState(0);
  const [ftuPromoCode, setFtuPromoCode] = useState("");
  const [recalculateAddress, setRecalculateAddress] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberError, setNumberError] = useState(null);
  const [autoProductDiscount, setAutoProductDiscount] = useState(0);

  const deliveryHouseNumber = useRef(null);
  const deliveryAddress = useRef(null);

  const promoCodeSchema = Yup.object().shape({
    promo_code: Yup.string().required(),
  });

  const {
    control: promoCodeControl,
    handleSubmit: promoCodeSubmit,
    errors: promoCodeErrors,
    setValue: setPromoValue,
  } = useForm({
    resolver: yupResolver(promoCodeSchema),
  });

  useEffect(() => {
    AsyncStorage.getItem("userData").then(async (res) => {
      const userData = JSON.parse(res);
      const user = userData.user_data.user;
      if (user.phone !== "110001001100111") {
        setPhoneNumber(user.phone);
      }
      setLoggedInUser(userData);
      if (userData.user_data.user.ftu) {
        try {
          const {
            data: { coupon },
          } = await Api.get("promo/autoloads");
          if (coupon) {
            setPromoValue("promo_code", coupon.promocode);
            setFtuPromoCode(coupon.promocode);
            setReRender((s) => s + 1);
            setTimeout(() => {
              verifyPromoCodeAlt(coupon.promocode);
            }, 1400);
          }
        } catch (e) {
          console.log(e);
        }
      }

      try {
        const {
          data: { productCoupons },
        } = await Api.get("promo/productCoupons");
        if (productCoupons.length > 0) {
          autoCalculateProductCoupons(productCoupons);
        }
      } catch (e) {
        console.log(e);
      }
    });
  }, []);

  const autoCalculateProductCoupons = (coupons) => {
    const couponAndValues = [];

    coupons.forEach((coupon) => {
      cart.cart.filter((c) => {
        let exists = 0;
        coupon.forEach((cp) => {
          exists =
            cp.product_id === c.product_id && cp.size_type === c.pizza_size
              ? exists + 1
              : exists;
        });
        const cpV = couponAndValues.map((cpvs) => cpvs.cartId);
        if (exists > 0 && !cpV.includes(c.id)) {
          couponAndValues.push({
            cartId: c.id,
            productName: c.product_name,
            value: coupon[0].value,
            totalPrice: c.total_price,
            discountedApplied: (c.total_price * coupon[0].value) / 100,
          });
        }
        return exists > 0;
      });
    });

    const totalDiscountApplied = couponAndValues.reduce(
      (a, b) => a + b.discountedApplied,
      0
    );

    setAutoProductDiscount(totalDiscountApplied || 0);
  };

  useEffect(() => {
    setDefaultAddress(addresses.find((address) => address.default === 1));
    setReRender((s) => s + 1);
  }, [addresses]);

  useEffect(() => {
    if (!defaultAddress) {
      setDeliveryCharge(0);
      setLoadingDeliveryFee(false);
      return;
    }
    if (deliveryType === "pickup") {
      if (ftuPromoCode) {
        verifyPromoCodeAlt(ftuPromoCode);
      }

      return setDeliveryCharge(0);
    }
    setLoadingDeliveryFee(true);
    const { longitude, latitude } = defaultAddress;

    Api.post("get-store-delivery-charge", {
      lng: longitude,
      lat: latitude,
      store_id: selectedStore.id,
    })
      .then(({ data }) => {
        verifyPromoCodeAlt(ftuPromoCode);

        if (!data.delivery_cost) {
          setLoadingDeliveryFee(false);
          return setDeliveryCharge(-1);
        }

        setLoadingDeliveryFee(false);
        setDeliveryCharge(+data.delivery_cost);
      })
      .catch((error) => {
        setDeliveryCharge(-1);
        setLoadingDeliveryFee(false);
        console.log(error, "deliveryChargeError");
      });
  }, [defaultAddress, recalculateAddress]);

  const delivery = Yup.object().shape({
    delivery_note: Yup.string(),
  });

  const {
    control: checkoutControl,
    handleSubmit: checkoutHandler,
    errors,
  } = useForm({
    resolver: yupResolver(delivery),
  });

  const address = Yup.object().shape({
    delivery_phone: Yup.string().required(),
  });

  const {
    control: addressControl,
    handleSubmit: handleAddressSubmit,
    errors: addressErrors,
  } = useForm({
    resolver: yupResolver(address),
  });

  const pickupSelectHandler = () => {
    setDeliveryType("pickup");
    setCouponAmount(0);
    setDeliveryCharge(0);
  };

  const deliverySelectHandler = async () => {
    setLoadingDeliveryFee(true);
    setCouponAmount(0);
    setDeliveryType("delivery");
    setDeliveryCharge(0);
    setRecalculateAddress((s) => s + 1);
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

  const showEditModalHandler = (address) => {
    setSelectedAddressEdit(address);
    setNewAddress(address);
    setShowAddAddress("Edit");
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
        } = await Api.post(
          `customers/${loggedInUser.user_data.user.customer_id}/delivery-address`,
          {
            ...address,
            customer_id: loggedInUser.user_data.user.customer_id,
          }
        );
        address.id = addressId;
        await addNewAddress(address);

        const prevAddresses = [...addresses].map((address) => ({
          ...address,
          default: 0,
        }));
        prevAddresses.unshift(address);
        setAddresses(prevAddresses);

        dispatch(addAddress(address));
      } else if (showAddAddress === "Edit") {
        newAddress.delivery_phone = data.delivery_phone;
        newAddress.house_number = data.house_number;

        await Api.put(
          `customers/${loggedInUser.user_data.user.customer_id}/delivery-address/${selectedAddressEdit.id}`,
          {
            ...newAddress,
            customer_id: loggedInUser.user_data.user.customer_id,
          }
        );
        syncAddress((addresses) => setAddresses(addresses));
      }
      syncAddress((data) => dispatch(initAddress(data)));
      setIsAddingAddress(false);
      setShowAddAddress(null);
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const setAddressAsDefault = async (addressId) => {
    try {
      await Api.post(
        `customers/${loggedInUser.user_data.user.customer_id}/set-default-delivery-address/${addressId}`
      );
      syncAddress((addresses) => setAddresses(addresses));
    } catch (e) {
      console.log(e);
    }
  };

  const onCloseAddressModalHandler = () => {
    setIsAddingAddress(false);
    setShowAddAddress(null);
  };

  const getDeliveryCharge = () => {
    return deliveryCharge !== -1 ? +deliveryCharge || 0 : 0;
  };

  const getTotalCost = () => {
    const total =
      +cart.totalPrice +
      getDeliveryCharge() -
      couponAmount -
      autoProductDiscount;
    return total > 0 ? total : 0;
  };

  const onCheckoutHandler = async (data) => {
    setNumberError(null);
    if (
      deliveryType === "pickup" &&
      (!phoneNumber || phoneNumber === "110001001100111")
    ) {
      setNumberError("This field is required");
      return;
    }
    const res = await AsyncStorage.getItem("userData");
    const userData = JSON.parse(res);

    navigation.navigate("Payment", {
      totalCost: getTotalCost(),
      deliveryType,
      selectedStore,
      loggedInUser: userData,
      deliveryCharge,
      defaultAddress,
      deliveryNote: data.delivery_note,
      couponAmount,
      autoProductDiscount,
      couponID,
      phoneNumber,
    });
  };

  const verifyPromoCodeAlt = async (promo_code) => {
    setVerifyingPromoCode(true);
    setCouponMessage(null);
    setCouponAmount(0);

    try {
      const { data: response } = await Api.get(`coupons?code=${promo_code}`);
      console.log({ response });
      setVerifyingPromoCode(false);

      if (!response) {
        setCouponAmount(0);
        setCouponID(null);
        return setCouponMessage("Invalid Promocode!");
      }

      let productAmountToBeAppliedOn = 0;
      if (response.products) {
        if (response.products.length > 0) {
          const cartProducts = cart.cart.filter((c) => {
            let exists = 0;
            response.products.forEach((p) => {
              exists =
                p.product_id === c.product_id && p.size_type === c.pizza_size
                  ? exists + 1
                  : exists;
            });
            return exists > 0;
          });

          if (cartProducts.length === 0) {
            setCouponAmount(0);
            setCouponID(null);
            return setCouponMessage(
              "Coupon is not applicable to the cart items!"
            );
          }

          productAmountToBeAppliedOn = cartProducts.reduce(
            (a, b) => a + b.total_price,
            0
          );
        }
      }

      if (!(response.products && response.products.length > 0)) {
        if (response.stores.length > 0) {
          const cityIds = response.stores;
          const couponIsAvailableForCity = cityIds.includes(+selectedStore.id);
          if (!couponIsAvailableForCity) {
            setCouponAmount(0);
            setCouponID(null);
            return setCouponMessage("Coupon is not available in your state!");
          }
        }
      }

      if (response.discounttype === "value") {
        setCouponID(response.id);
        return setCouponAmount(+response.promodiscount);
      }

      if (response.discounttype === "percentage") {
        setCouponID(response.id);
        return setCouponAmount(
          (+response.promodiscount *
            (productAmountToBeAppliedOn > 0
              ? productAmountToBeAppliedOn
              : cart.totalPrice)) /
            100
        );
      }
    } catch (e) {
      console.log(e);
      setCouponID(null);
      setVerifyingPromoCode(false);
    }
  };

  const verifyPromoCode = async (data) => {
    await verifyPromoCodeAlt(data.promo_code);
  };

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={s.checkoutHeaderContainer}>
          {cart.cart.map((cartItem) => (
            <View key={cartItem.id} style={s.headerRow}>
              {cartItem.pizza_size && cartItem.product_type !== "drink" && (
                <MyText
                  title={`${truncateString(
                    cartItem.product_name,
                    20
                  )} (${firstCharacter(cartItem.pizza_size)}) x ${
                    cartItem.quantity
                  }`}
                  style={s.label}
                />
              )}
              {!cartItem.pizza_size && cartItem.product_type !== "drink" && (
                <MyText
                  title={`${truncateString(cartItem.product_name, 20)} x ${
                    cartItem.quantity
                  }`}
                  style={s.label}
                />
              )}
              {cartItem.product_type === "drink" && (
                <MyText
                  title={`${truncateString(cartItem.product_name, 20)} (${
                    cartItem.pizza_size
                  }) x ${cartItem.quantity}`}
                  style={s.label}
                />
              )}

              <MyText
                title={`₦${(+cartItem.total_price).toLocaleString()}`}
                style={s.price}
              />
            </View>
          ))}

          {autoProductDiscount > 0 && (
            <View style={s.headerRow}>
              <MyText title="Total Product Discount Applied" style={s.label} />
              <MyText
                title={`-₦${autoProductDiscount.toLocaleString()}`}
                style={s.price}
              />
            </View>
          )}
        </View>

        <View style={s.whiteSection}>
          <MyText title="Delivery method" style={[s.label, s.labelBlack]} />
        </View>

        <View style={s.greenSection}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <TouchableOpacity
              onPress={pickupSelectHandler}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                marginRight: 15,
              }}
            >
              <RadioButton.Android
                value="pickup"
                color="white"
                key="pickup"
                uncheckedColor="white"
                status={deliveryType === "pickup" ? "checked" : "unchecked"}
                onPress={pickupSelectHandler}
              />
              <MyText title={"Pickup In Store"} h6 style={s.price} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={deliverySelectHandler}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <RadioButton.Android
                value="delivery"
                color={"white"}
                key="delivery"
                uncheckedColor={"white"}
                status={deliveryType === "delivery" ? "checked" : "unchecked"}
                onPress={deliverySelectHandler}
              />
              <MyText title={"Delivery"} h6 style={s.price} />
            </TouchableOpacity>
          </View>
        </View>

        {deliveryType === "delivery" && (
          <>
            <View style={s.whiteSection}>
              <MyText
                title="Delivery address"
                style={[s.label, s.labelBlack]}
              />
              <Pressable
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                onPress={() => setAddressModalVisible(true)}
              >
                <MyText
                  title={defaultAddress ? "Edit Address" : "Add Address"}
                  style={[s.label, s.labelBlack, s.labelLink]}
                />
              </Pressable>
            </View>

            <View style={s.greenSection}>
              <MyText
                title={
                  defaultAddress
                    ? truncateString(defaultAddress.address, 40)
                    : "Please add an address"
                }
                style={s.label}
              />
            </View>

            <View style={s.whiteSection}>
              <MyText title="Delivery charge" style={[s.label, s.labelBlack]} />
            </View>

            <View style={s.greenSection}>
              <MyText title="Delivery Charge" style={s.label} />
              {loadingDeliveryFee ? (
                <ActivityIndicator size="small" color={Colors.primaryColor} />
              ) : (
                <MyText
                  title={
                    deliveryCharge !== -1
                      ? `₦${getDeliveryCharge()}`
                      : "Address out of reach."
                  }
                  style={s.price}
                />
              )}
            </View>
          </>
        )}

        <View style={s.whiteSection}>
          <MyText title="Promocode" style={[s.label, s.labelBlack]} />
          {/*<Pressable onPress={() => setPromoModalVisible(true)}>*/}
          {/*    <MyText title="Edit" style={[s.label, s.labelBlack, s.labelLink]}/>*/}
          {/*</Pressable>*/}
        </View>

        <View style={[s.greenSection, { paddingVertical: 10 }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={s.promoCodeContainer}
          >
            <View style={{ width: "80%" }}>
              <View style={s.promoCodeContainer}>
                <Controller
                  name="promo_code"
                  defaultValue={ftuPromoCode}
                  control={promoCodeControl}
                  render={({ onChange, value }) => (
                    <>
                      <Input
                        onChangeText={(text) => {
                          onChange(text);
                        }}
                        style={{ width: "100%" }}
                        value={value}
                        placeholder={"PROMOCODE"}
                        keyboardType="default"
                        returnKeyType="next"
                        onSubmitEditing={promoCodeSubmit(verifyPromoCode)}
                      />
                    </>
                  )}
                />
              </View>

              <View style={s.promoCodeContainer}>
                <CustomButton
                  style={{
                    paddingVertical: 7,
                    paddingHorizontal: 10,
                    width: "auto",
                  }}
                  title="Apply"
                  isLoading={verifyingPromoCode}
                  indicatorColor={Colors.primaryColor}
                  onPress={promoCodeSubmit(verifyPromoCode)}
                />

                <MyText
                  title={couponMessage}
                  h6
                  style={{
                    marginLeft: 5,
                    color: "white",
                    fontFamily: "GilroyBold",
                  }}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <MyText
            title={`-₦${couponAmount.toLocaleString()}`}
            style={s.price}
          />
        </View>

        {deliveryType === "pickup" && (
          <>
            <View style={s.whiteSection}>
              <MyText title="Phone Number" style={[s.label, s.labelBlack]} />
            </View>

            <View style={{ ...s.greenSection, flexDirection: "column" }}>
              <Input
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setNumberError(null);
                }}
                style={{ width: "100%" }}
                defaultValue={phoneNumber}
                placeholder={"Phone Number"}
                keyboardType="default"
                returnKeyType="next"
              />
              <MyText style={{ color: "red" }} p title={numberError} />
            </View>
          </>
        )}

        <View style={s.whiteSection}>
          <MyText title="Total cost" style={[s.label, s.labelBlack]} />
        </View>

        <View style={s.greenSection}>
          <MyText title="Total cost" style={s.price} />
          <MyText
            title={`₦${getTotalCost().toLocaleString()}`}
            style={s.price}
          />
        </View>

        {deliveryType === "delivery" && (
          <View
            // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[s.whiteSection, s.deliverySection]}
          >
            <MyText title="Delivery note" style={[s.label, s.labelBlack]} />
            <ControlledInput
              style={s.deliveryNote}
              multiline={true}
              noOfLines={3}
              name="delivery_note"
              control={checkoutControl}
            />
          </View>
        )}

        <View style={s.whiteSection}>
          <CustomButton
            disabled={
              (deliveryType === "delivery" && !defaultAddress) ||
              (deliveryType === "delivery" && deliveryCharge === -1)
            }
            style={s.continueBtn}
            onPress={checkoutHandler(onCheckoutHandler)}
            title="Continue"
            textStyle={s.continueBtnText}
          />
        </View>
      </ScrollView>

      <View style={s.footer}>
        <ImageBackground source={footerImage} style={s.footerImage} />
      </View>

      <CheckoutModal
        modalVisible={addressModalVisible}
        doneHandler={
          showAddAddress
            ? handleAddressSubmit(addAddressHandler)
            : () => setAddressModalVisible(false)
        }
        title="Delivery Address"
        buttonText={
          showAddAddress === "Edit"
            ? "Update"
            : showAddAddress === "Add"
            ? "Add"
            : "Done"
        }
        btnIsLoading={isAddingAddress}
        closeBtnText={showAddAddress ? "Close" : null}
        onCloseHandler={onCloseAddressModalHandler}
      >
        {!showAddAddress && (
          <>
            <ScrollView style={s.modalContainer}>
              {addresses.map((address) => (
                <Pressable
                  key={address.id}
                  onPress={() => setAddressAsDefault(address.id)}
                  style={[s.modalRow, address.default === 1 && s.greenModalRow]}
                >
                  <MyText
                    style={[
                      s.modalRowText,
                      !(address.hasOwnProperty("default") && address.default) &&
                        s.modalRowTextBlack,
                    ]}
                    title={truncateString(address.address, 30)}
                  />
                  <Pressable
                    hitSlop={{ right: 5, left: 10, top: 5, bottom: 5 }}
                    onPress={() => showEditModalHandler(address)}
                  >
                    <MyText style={s.modalRowLink} title="Edit" />
                  </Pressable>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              onPress={() => setShowAddAddress("Add")}
              style={s.modalAdd}
            >
              <MyText style={s.modalAddLink} title="+ Add address" />
            </Pressable>
          </>
        )}

        {showAddAddress && (
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={s.modalContainer}
          >
            <ControlledInput
              control={addressControl}
              defaultValue={
                showAddAddress === "Edit"
                  ? selectedAddressEdit.delivery_phone
                  : ""
              }
              keyboardType="phone-pad"
              placeholder="Phone number"
              name="delivery_phone"
              onSubmitEditing={() => deliveryHouseNumber.current?.focus()}
            />

            <Text
              style={{
                fontFamily: "GilroyLight",
              }}
            >
              Please enter your house number
            </Text>

            <ControlledInput
              innerRef={deliveryHouseNumber}
              control={addressControl}
              defaultValue={
                showAddAddress === "Edit"
                  ? selectedAddressEdit.house_number
                  : ""
              }
              keyboardType="numeric"
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
        )}
      </CheckoutModal>

      <ScreenHeader
        hasBackButtonAlt={true}
        hasNavigationDrawerIcon={false}
        hasCartIcon={false}
        title="CHECKOUT"
        color={Colors.primaryColor}
        navigation={navigation}
      />
    </>
  );
};

const s = StyleSheet.create({
  checkoutHeaderContainer: {
    backgroundColor: Colors.checkoutGreen,
    paddingTop: 220,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  label: {
    color: "white",
    fontFamily: "GilroyLight",
    fontSize: 18,
  },
  labelBlack: {
    color: "#707070",
    fontSize: 16,
  },
  labelLink: {
    color: Colors.primaryColor,
    textDecorationLine: "underline",
  },
  price: {
    color: "white",
    fontFamily: "GilroyBlack",
    fontSize: 18,
  },
  whiteSection: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  greenSection: {
    paddingHorizontal: 30,
    paddingVertical: 25,
    backgroundColor: Colors.checkoutGreen,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliverySection: {
    flexDirection: "column",
  },
  deliveryNote: {
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderBottomColor: "#E2E2E2",
    textAlignVertical: "top",
    paddingHorizontal: 10,
  },
  continueBtn: {
    backgroundColor: Colors.lightGreen,
    marginBottom: 60,
  },
  continueBtnText: {
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
  modalContainer: {
    width: "100%",
    maxHeight: "65%",
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    padding: 15,
    borderRadius: 7,
    backgroundColor: Colors.light,
  },
  greenModalRow: {
    backgroundColor: Colors.checkoutGreen,
  },
  modalRowText: {
    color: "white",
    fontFamily: "GilroyLight",
    fontSize: 15,
  },
  modalRowTextBlack: {
    color: "#707070",
    // color: 'white'
  },
  modalRowLink: {
    color: Colors.primaryColor,
    textDecorationLine: "underline",
    fontSize: 15,
    fontFamily: "GilroyBold",
  },
  modalPriceText: {
    color: "white",
    fontSize: 15,
    fontFamily: "GilroyBold",
  },
  modalPriceBlack: {
    color: "#707070",
  },
  modalAdd: {
    paddingHorizontal: 15,
    width: "100%",
  },
  modalAddLink: {
    color: Colors.gold,
    fontFamily: "GilroyBold",
    fontSize: 15,
  },
  mapInputContainer: {
    paddingVertical: 0,
    height: 150,
    backgroundColor: "transparent",
  },
  promoCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  promocodeText: {
    color: Colors.grey,
    fontFamily: "GilroyRegular",
  },
});
