import { View, ScrollView, StyleSheet, ImageBackground } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScreenHeader from "../../components/UI/ScreenHeader";

import { addItemToCart } from "../../services/cartService";

import MyText from "../../components/UI/MyText";
import CrustSelector from "../../components/UI/CrustSelector";
import SizeSelector from "../../components/UI/SizeSelector";
import CustomButton from "../../components/UI/CustomButton";
import AddedToCartModal from "../../components/UI/AddedToCartModal";
import Colors from "../../constants/Colors";

import pizzaImage from "../../assets/img/deals.png";
import footerImage from "../../assets/img/auth-header.png";
import AddToppingModal from "../../components/UI/AddToppingModal";
import AddedToppings from "../../components/UI/AddedToppings";
import QuantityInput from "../../components/UI/QuantityInput";

export default ({ navigation }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const item = navigation.getParam("deal");

  item.priceLarge =
    item.sizes.find((size) => size.size.size_type === "Large")?.price.price ||
    0;
  item.priceMedium =
    item.sizes.find((size) => size.size.size_type === "Medium")?.price.price ||
    0;
  item.priceSmall =
    item.sizes.find((size) => size.size.size_type === "Small")?.price.price ||
    0;

  // item.priceLarge = item.sizes[0]?.price.price || 0
  // item.priceMedium = 0
  // item.priceSmall = 0

  const [quantity, setQuantity] = React.useState(1);
  const [crustType, setCrustType] = React.useState("Traditional Crust");
  const [pizzaSize, setPizzaSize] = React.useState("Large");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const onToggleTopping = (selectedToppings) => {
    setSelectedToppings(selectedToppings);
  };

  // console.log(first)
  const addToCartHandler = () => {
    let allSelectedToppings = [...selectedToppings];
    const productPrice =
      item.sizes.find((size) => size.size.size_type === pizzaSize)?.price
        .price || 0;
    const selectedSizePrice = productPrice;
    let toppingPrice =
      selectedToppings.length > 0
        ? selectedToppings
            .map((topping) => +topping.price)
            .reduce((a, b) => a + b)
        : 0;

    let subtotal = +selectedSizePrice + +toppingPrice;
    let totalPrice = subtotal * quantity;

    addItemToCart(
      dispatch,
      cart,
      item,
      quantity,
      subtotal,
      totalPrice,
      productPrice,
      null,
      null,
      crustType,
      pizzaSize,
      allSelectedToppings.map((topping) => ({
        id: topping.id,
        name: topping.topping_name,
      })),
      "pizza",
      () => setModalVisible(true)
    );
  };

  return (
    <>
      <View style={{ height: "100%" }}>
        <ScrollView showsVerticalScrollIndicator={false} style={s.container}>
          <View style={s.headerImageContainer}>
            <ImageBackground source={pizzaImage} style={s.headerImage} />
          </View>

          <View style={s.mainSection}>
            <MyText title={item.name} style={s.name} />
            <MyText title={item.description} style={s.description} />

            <CrustSelector cb={(value) => setCrustType(value)} />

            <SizeSelector
              price1={item?.priceLarge}
              // price1={item.price}
              price2={item.priceMedium}
              price3={item.priceSmall}
              hasSmallSize={!!item.priceSmall}
              containerStyle={{ marginVertical: 15 }}
              cb={(value) => {
                setPizzaSize(value.size);
              }}
            />

            <AddedToppings
              toppings={selectedToppings}
              heading={"Toppings added"}
            />

            <CustomButton
              style={s.addTopping}
              textStyle={{ color: "white" }}
              title={"Add Topping(s)"}
              onPress={() => setShowToppingModal(true)}
            />

            <QuantityInput callback={(value) => setQuantity(+value)} />

            <View style={s.cartButtons}>
              <CustomButton
                disabled={!quantity}
                style={s.addToCart}
                textStyle={{ color: "white" }}
                title="add to cart"
                onPress={addToCartHandler}
              />
              <CustomButton
                style={s.viewCart}
                textStyle={{ color: Colors.lightGreen }}
                title="view/edit cart"
                onPress={() => navigation.navigate("Cart")}
              />
            </View>
          </View>
        </ScrollView>

        <View style={s.footer}>
          <ImageBackground source={footerImage} style={s.footerImage} />
        </View>
      </View>

      <ScreenHeader
        title=""
        hasBackButtonAlt={true}
        hasNavigationDrawerIcon={false}
        color={Colors.primaryColor}
        navigation={navigation}
      />

      <AddToppingModal
        showPrice={item.name !== "My Pizza Jungle"}
        maxToppings={null}
        showModal={showToppingModal}
        onCloseModal={() => setShowToppingModal(false)}
        onToggleTopping={onToggleTopping}
      />

      <AddedToCartModal
        modalVisible={modalVisible}
        continueHandler={() => {
          setModalVisible(false);
          navigation.navigate("Home");
        }}
        cartHandler={() => {
          setModalVisible(false);
          navigation.navigate("Cart");
        }}
      />
    </>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImageContainer: {
    height: 250,
  },
  headerImage: {
    height: "100%",
  },
  mainSection: {
    paddingHorizontal: 30,
    paddingVertical: 25,
    alignItems: "center",
  },
  name: {
    fontSize: 30,
    fontFamily: "GilroyBlack",
    color: Colors.primaryColor,
    textTransform: "uppercase",
    textAlign: "center",
    width: 220,
    marginBottom: 10,
  },
  description: {
    fontSize: 17,
    fontFamily: "GilroyRegular",
    marginBottom: 15,
    textAlign: "center",
  },
  addTopping: {
    backgroundColor: Colors.lightGreen,
    marginBottom: 15,
  },
  selectBox: {
    marginBottom: 15,
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    borderRadius: 5,
    overflow: "hidden",
  },
  cartButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 100,
    marginTop: 20,
  },
  addToCart: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    borderWidth: 1,
    borderColor: Colors.lightGreen,
    paddingHorizontal: 0,
    marginRight: 5,
  },
  viewCart: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.lightGreen,
    paddingHorizontal: 0,
    marginLeft: 5,
  },
  footer: {
    height: 10,
    backgroundColor: "red",
  },
  footerImage: {
    width: "100%",
    height: "100%",
  },
});
