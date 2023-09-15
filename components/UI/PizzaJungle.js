import { ScrollView, View, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import CustomButton from "./CustomButton";

import CrustSelector from "./CrustSelector";
import SizeSelector from "./SizeSelector";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../services/cartService";
import AddedToCartModal from "./AddedToCartModal";
import AddedToppings from "./AddedToppings";
import AddToppingModal from "./AddToppingModal";
import QuantityInput from "./QuantityInput";

export default ({ navigation, pizza: item }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  item.priceLarge =
    item.sizes.find((size) => size.size.size_type === "Large")?.price.price ||
    0;
  item.priceMedium =
    item.sizes.find((size) => size.size.size_type === "Medium")?.price.price ||
    0;

  const [quantity, setQuantity] = React.useState(1);
  const [crustType, setCrustType] = React.useState("Traditional Crust");
  const [pizzaSize, setPizzaSize] = React.useState("Large");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [toppings, setToppings] = React.useState([]);

  const quantityList = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "5", value: 5 },
    { label: "10", value: 10 },
  ];

  const onToggleTopping = (selectedToppings) => {
    setSelectedToppings(selectedToppings);
  };

  const addToCartHandler = () => {
    console.log("HERE", selectedToppings, "TOPPINGS JUNGLE");
    const productPrice =
      item.sizes.find((size) => size.size.size_type === pizzaSize)?.price
        .price || 0;
    const selectedSizePrice = productPrice * quantity;
    let totalPrice =
      selectedToppings.length > 0
        ? selectedToppings
            .map((topping) => +topping.price)
            .reduce((a, b) => a + b)
        : 0;
    totalPrice += +selectedSizePrice;

    addItemToCart(
      dispatch,
      cart,
      item,
      quantity,
      totalPrice,
      productPrice,
      null,
      null,
      crustType,
      pizzaSize,
      selectedToppings.map((topping) => ({
        id: topping.id,
        name: topping.topping_name,
      })),
      "pizza",
      () => setModalVisible(true)
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center" }}
      style={s.container}
    >
      <CrustSelector cb={(value) => setCrustType(value)} />

      <Image style={s.pizzaImage} source={{ uri: item.productimage }} />

      <SizeSelector
        price1={item.priceLarge}
        price2={item.priceMedium}
        containerStyle={{ marginVertical: 15 }}
        cb={(value) => setPizzaSize(value.size)}
      />

      <AddedToppings toppings={selectedToppings} />

      <CustomButton
        style={s.addTopping}
        textStyle={{ color: "white" }}
        title="Add topping"
        onPress={() => setShowToppingModal(true)}
      />

      <QuantityInput callback={(value) => setQuantity(+value)} />

      <View style={s.cartButtons}>
        <CustomButton
          disabled={!quantity && !selectedToppings.length}
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

      <AddToppingModal
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
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: {
    paddingLeft: 35,
    paddingRight: 10,
    paddingTop: 20,
  },
  pizzaImage: {
    width: 170,
    height: 170,
    marginVertical: 20,
  },
  toppingHeader: {
    fontFamily: "GilroyBold",
    fontSize: 17,
    marginTop: 15,
    marginBottom: 7,
  },
  toppings: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  topping: {
    color: Colors.gold,
    fontFamily: "GilroySemiBold",
    fontSize: 16,
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
    marginBottom: 250,
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
});
