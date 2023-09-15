import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect } from "react";
import footerImage from "../../assets/img/auth-header.png";
import ScreenHeader from "../../components/UI/ScreenHeader";
import MyText from "../../components/UI/MyText";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/UI/CustomButton";
import AddedToCartModal from "../../components/UI/AddedToCartModal";
import { addItemToCart } from "../../services/cartService";
import { useDispatch, useSelector } from "react-redux";
import SizeSelector from "../../components/UI/SizeSelector";
import QuantityInput from "../../components/UI/QuantityInput";

const dimension = Dimensions.get("window");

export default ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((c) => c.cart);
  const drink = navigation.getParam("item");
  const [drinkSize, setDrinkSize] = React.useState(
    drink?.sizes[0]?.size?.size_type
  );

  drink.priceLarge =
    drink?.sizes.find((size) => size.size.size_category === "SMALL")?.price
      .price || 0;

  const [quantity, setQuantity] = React.useState(1);

  const [modalVisible, setModalVisible] = React.useState(false);

  const addToCartHandler = () => {
    console.log("RIGHT HERE SIDE KICKS");
    const productPrice =
      drink?.sizes.find((size) => size.size.size_type === drinkSize)?.price
        .price || 0;
    const totalPrice = productPrice * quantity;

    addItemToCart(
      dispatch,
      cart,
      drink,
      quantity,
      productPrice,
      totalPrice,
      productPrice,
      null,
      null,
      null,
      drinkSize,
      [],
      "drink",
      () => setModalVisible(true)
    );
  };

  return (
    <>
      <ScreenHeader
        title=""
        hasBackButtonAlt
        hasNavigationDrawerIcon={false}
        navigation={navigation}
        color="white"
      />

      <ScrollView style={{ marginTop: 120 }}>
        <View style={s.container}>
          <View style={s.card}>
            <Image source={{ uri: drink.productimage }} style={s.drinkImage} />
          </View>

          <MyText
            title={drink?.name}
            style={[
              s.title,
              drink?.sizes.length > 1 && s.titleSmallMarginBottom,
            ]}
          />

          {drink?.sizes.length === 1 && (
            <MyText
              title={`₦${drink?.sizes[0]?.price.price}`}
              style={s.price}
            />
          )}

          {drink?.sizes.length > 1 && (
            <SizeSelector
              price1={drink.priceLarge}
              price2={null}
              price3={null}
              label1={
                drink?.sizes.find((size) => size.size.size_category === "SMALL")
                  .size.size_type
              }
              // label2={drink.sizes.find(size => size.size.size_category === 'SMALL').size.size_type}
              containerStyle={{ marginVertical: 10 }}
              cb={(value) => {
                setDrinkSize(value.size);
              }}
            />
          )}

          <QuantityInput callback={(value) => setQuantity(+value)} />

          <View style={s.cartButtons}>
            <CustomButton
              style={s.addToCart}
              disabled={!quantity}
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
  footer: {
    height: 10,
    backgroundColor: "red",
  },
  footerImage: {
    width: "100%",
    height: "100%",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  card: {
    paddingVertical: 10,
    paddingHorizontal: 70,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drinkImage: {
    width: 180,
    height: 240,
  },
  title: {
    fontFamily: "GilroyBlack",
    fontSize: 22,
    color: Colors.lightGreen,
    textTransform: "uppercase",
    marginBottom: 50,
  },
  titleSmallMarginBottom: {
    marginBottom: 15,
  },
  price: {
    fontFamily: "GilroyBold",
    fontSize: 19,
    color: Colors.lightGreen,
    marginBottom: dimension.height * 0.03,
  },
  selectBox: {
    marginBottom: 0,
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    borderRadius: 5,
    overflow: "hidden",
  },
  cartButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 100,
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
