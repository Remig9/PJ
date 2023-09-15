import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import pizzaImage from "../../assets/img/deals.png";
import MyText from "./MyText";
import CrustSelector from "./CrustSelector";
import SizeSelector from "./SizeSelector";
import CustomButton from "./CustomButton";
import Colors from "../../constants/Colors";
import footerImage from "../../assets/img/auth-header.png";
import ScreenHeader from "./ScreenHeader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../services/cartService";
import AddedToCartModal from "./AddedToCartModal";
import AddedToppings from "./AddedToppings";
import AddToppingModal from "./AddToppingModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QuantityInput from "./QuantityInput";
import RNModalSelect from "rn-awesome-select";

const TwoSidesComponent = ({ navigation, pizzaType }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const item = navigation.getParam("item");

  item.priceLarge =
    item.sizes.find((size) => size.size.size_type === "Large")?.price.price ||
    0;
  item.priceMedium =
    item.sizes.find((size) => size.size.size_type === "Medium")?.price.price ||
    0;
  item.priceSmall =
    item.sizes.find((size) => size.size.size_type === "Small")?.price.price ||
    0;

  useEffect(() => {
    AsyncStorage.getItem(pizzaType).then((res) => {
      const pizzas = JSON.parse(res);
      if (pizzaType === "classicPizza") {
        const filteredPizzas = pizzas?.filter(
          (pizza) =>
            pizza.name.toLowerCase() !== "all season mangrove" &&
            pizza.name !== "all seasons mangrove"
        );
        setPizzas(filteredPizzas);
      } else {
        const filteredPizzas = pizzas?.filter(
          (pizza) =>
            pizza.name !== "Surf 'n' Turf" &&
            pizza.name.toLowerCase() !== "my pizza jungle"
        );
        setPizzas(filteredPizzas);
      }
    });
  }, []);

  const [quantity, setQuantity] = React.useState(1);
  const [crustType, setCrustType] = React.useState("Traditional Crust");
  const [pizzaSize, setPizzaSize] = React.useState("Large");
  const [pizzas, setPizzas] = useState([]);

  const [pizza1, setPizza1] = React.useState("");
  const [pizza2, setPizza2] = React.useState("");
  const [openPizzaVisible, setOpenPizzaVisible] = React.useState(false);
  const [openPizza2Visible, setOpenPizza2Visible] = React.useState(false);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const selectItems = pizzas
    .map((product) => ({
      ...product,
      label: product.name,
      value: product.name,
    }))
    .filter((product) => !product.name.includes("Two Sides"));

  const onToggleTopping = (selectedToppings) => {
    setSelectedToppings(selectedToppings);
  };

  const addToCartHandler = () => {
    console.log("RIGHT HERE...TWO SIDES");
    const productPrice =
      item.sizes.find((size) => size.size.size_type === pizzaSize)?.price
        .price || 0;
    let totalPrice =
      selectedToppings.length > 0
        ? selectedToppings
            .map((topping) => +topping.price)
            .reduce((a, b) => a + b)
        : 0;
    const subtotal = +totalPrice + +productPrice;
    totalPrice = subtotal * quantity;

    addItemToCart(
      dispatch,
      cart,
      item,
      quantity,
      subtotal,
      totalPrice,
      productPrice,
      pizza1.label,
      pizza2.label,
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
    <>
      <View style={{ height: "100%" }}>
        <ScrollView showsVerticalScrollIndicator={false} style={s.container}>
          <View style={s.headerImageContainer}>
            <ImageBackground source={pizzaImage} style={s.headerImage} />
          </View>

          <View style={s.mainSection}>
            <MyText title={item.name} style={s.name} />
            <MyText title={item.description} style={s.description} />

            {/* <PizzaSelector
              placeholder={"Select Pizza"}
              title='1st Half'
              cb={(value) => setPizza1(value)}
              items={selectItems}
            /> */}
            {selectItems && (
              <>
                <TouchableOpacity
                  onPress={() => setOpenPizzaVisible(true)}
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    width: "90%",
                    alignItems: "center",
                    borderRadius: 12,
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.primaryColor,
                      fontWeight: "700",
                      fontFamily: "GilroySemiBold",
                    }}
                  >
                    {pizza1 ? pizza1?.label : "Select Pizza"}
                  </Text>
                </TouchableOpacity>
                <RNModalSelect
                  items={selectItems}
                  itemLabelFieldName="label"
                  enableSearch={true}
                  title="1st Half"
                  showSelect={openPizzaVisible}
                  onItemSelected={(value) => setPizza1(value)}
                  onClose={() => setOpenPizzaVisible(false)}
                />
              </>
            )}
            {selectItems && (
              <>
                <TouchableOpacity
                  onPress={() => setOpenPizza2Visible(true)}
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    width: "90%",
                    alignItems: "center",
                    borderRadius: 12,
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.primaryColor,
                      fontWeight: "700",
                      fontFamily: "GilroySemiBold",
                    }}
                  >
                    {pizza2 ? pizza2?.label : "Select Pizza"}
                  </Text>
                </TouchableOpacity>
                <RNModalSelect
                  items={selectItems}
                  itemLabelFieldName="label"
                  enableSearch={true}
                  title="2nd Half"
                  showSelect={openPizza2Visible}
                  onItemSelected={(value) => setPizza2(value)}
                  onClose={() => setOpenPizza2Visible(false)}
                />
              </>
            )}

            {/* <PizzaSelector
              placeholder={"Select Pizza"}
              title='2nd Half'
              cb={(value) => setPizza2(value)}
              items={selectItems}
            /> */}

            <CrustSelector cb={(value) => setCrustType(value)} />

            <SizeSelector
              price1={item.priceLarge}
              price2={item.priceMedium}
              price3={item.priceSmall}
              hasSmallSize={!!item.priceSmall}
              containerStyle={{ marginVertical: 15 }}
              cb={(value) => {
                setPizzaSize(value.size);
              }}
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
                disabled={!selectedToppings.length}
                // disabled={!pizza1 || !pizza2 || !quantity}
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
        hasNavigationDrawerIcon={false}
        hasBackButtonAlt
        title=""
        color={Colors.primaryColor}
        navigation={navigation}
      />

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
    </>
  );
};

export default TwoSidesComponent;

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
  nameContainer: {},
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
