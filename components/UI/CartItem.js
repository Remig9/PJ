import { Image, Pressable, View, StyleSheet } from "react-native";
import RemoveIcon from "../../assets/img/remove.png";
import MyText from "./MyText";
import { firstCharacter } from "../../services/typography";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import {
  deleteCartItem,
  updateCartItemPrice,
} from "../../services/cartService";
import { useDispatch } from "react-redux";
import QuantityInput from "./QuantityInput";

const CartItem = ({ item, index, cartLength }) => {
  const dispatch = useDispatch();
  const [cartItem, setCartItem] = useState(item);
  const [quantity, setQuantity] = useState(+item.quantity);

  const removeHandler = (cartId) => {
    deleteCartItem(cartId, dispatch, () => {});
  };

  const changeQuantityHandler = (value) => {
    setQuantity(+value);
    const total = item.product_subtotal * +value;
    const newItem = {
      ...cartItem,
      quantity: +value,
      total: total,
      total_price: total,
    };
    setCartItem(newItem);
    updateCartItemPrice(dispatch, newItem, () => {});
  };

  if (!cartItem.id) {
    return <View />;
  }

  return (
    <View style={[s.cartItem, index === cartLength - 1 ? s.lastItem : null]}>
      <Pressable
        style={s.removeIconContainer}
        onPress={() => removeHandler(item.id)}
      >
        <Image source={RemoveIcon} style={s.removeIcon} />
      </Pressable>
      <Image source={{ uri: item.product_image }} style={s.productImage} />
      {/*<Image source={pizzaProducts[0].products[1].image} style={s.productImage}/>*/}

      <View style={s.cartDescription}>
        {item.pizza_size && item.product_type !== "drink" && (
          <MyText
            title={`${item.product_name} (${firstCharacter(
              item.pizza_size
            )}) x${item.quantity}`}
            style={s.productName}
          />
        )}
        {!item.pizza_size && item.product_type !== "drink" && (
          <MyText
            title={`${item.product_name} x${item.quantity}`}
            style={s.productName}
          />
        )}

        {item.product_type === "drink" && (
          <MyText
            title={`${item.product_name} x${item.quantity}`}
            style={s.productName}
          />
        )}

        {item.product_type === "drink" && (
          <MyText title={item.pizza_size} style={s.productDescription} />
        )}

        {item.pizza1 && (
          <MyText title={item.pizza1} style={s.productDescription} />
        )}
        {item.pizza2 && (
          <MyText title={item.pizza2} style={s.productDescription} />
        )}

        {JSON.parse(item.toppings).length > 0 && (
          <MyText
            title={JSON.parse(item.toppings)
              .map((topping) => topping.name)
              .join(", ")}
            style={s.productDescription}
          />
        )}

        <QuantityInput
          callback={(value) => changeQuantityHandler(value)}
          small
          initQuantity={+item.quantity}
          style={{ marginBottom: 5, marginTop: 5 }}
        />
        <MyText
          title={`₦${(+cartItem.total_price).toLocaleString()}`}
          style={s.productPrice}
        />
      </View>
    </View>
  );
};

export default CartItem;

const s = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 2,
    borderColor: Colors.light,
    paddingVertical: 25,
    position: "relative",
    paddingHorizontal: 20,
  },
  lastItem: {
    borderColor: "transparent",
  },
  removeIconContainer: {
    position: "absolute",
    top: 10,
    right: 5,
    padding: 10,
  },
  removeIcon: {
    width: 10,
    height: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
  },
  cartDescription: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: "center",
  },
  productName: {
    fontFamily: "GilroyBold",
    fontSize: 15,
  },
  productDescription: {
    marginVertical: 2,
    fontFamily: "GilroyLight",
    fontSize: 13,
    color: Colors.grey,
  },
  productPrice: {
    fontFamily: "GilroyBold",
    fontSize: 15,
    color: Colors.lightGreen,
  },
});
