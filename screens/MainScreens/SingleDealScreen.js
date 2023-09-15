import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import pizzaImage from "../../assets/img/deals.png";
import MyText from "../../components/UI/MyText";
// import PizzaSelector from "../../components/UI/PizzaSelector";
import CrustSelector from "../../components/UI/CrustSelector";
import CustomButton from "../../components/UI/CustomButton";
import Colors from "../../constants/Colors";
import footerImage from "../../assets/img/auth-header.png";
import ScreenHeader from "../../components/UI/ScreenHeader";
import PizzaJungle from "../../assets/img/pizza-jungle.png";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../services/cartService";
import AddedToCartModal from "../../components/UI/AddedToCartModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddToppingModal from "../../components/UI/AddToppingModal";
import AddedToppings from "../../components/UI/AddedToppings";
// import QuantityInput from "../../components/UI/QuantityInput";
import Api from "../../helpers/axios";
import RNModalSelect from "rn-awesome-select";
import { CLASSIC_PIZZA_ID } from "../../helpers/constants";
import { SPECIAL_PIZZA_ID } from "../../helpers/constants";
import { DESSERT_PIZZA_ID } from "../../helpers/constants";
import { SIDEKICKS } from "../../helpers/constants";
import QuantityInput from "../../components/UI/QuantityInput";

export default ({ navigation }) => {
  const dispatch = useDispatch();
  const [classicPizza, setClassicPizza] = useState([]);
  const [specialPizza, setSpecialPizza] = useState([]);
  const [dessertPizza, setDessertPizza] = useState([]);
  const [sidekicks, setSidekicks] = useState([]);
  // const [pizzaJungle, setPizzaJungle] = useState(null);
  const [items, setItems] = useState([]);

  const cart = useSelector((state) => state.cart);
  const deal = navigation.getParam("deal");

  useEffect(() => {
    const fetchClassicPizzas = async () => {
      // let fetchedPizzas = [];
      const store = await AsyncStorage.getItem("selectedStore");
      if (store) {
        const restaurant = JSON.parse(store);
        const restaurantId = restaurant.id;

        try {
          const {
            data: { data: classicPizza },
          } = await Api(
            `/categories/products?id=${CLASSIC_PIZZA_ID}&store_id=${restaurantId}`
          );
          setClassicPizza(classicPizza);

          AsyncStorage.setItem("classicPizza", JSON.stringify(classicPizza));

          const {
            data: { data: specialPizza },
          } = await Api(
            `/categories/products?id=${SPECIAL_PIZZA_ID}&store_id=${restaurantId}`
          );
          setSpecialPizza(specialPizza);

          AsyncStorage.setItem("specialPizza", JSON.stringify(specialPizza));

          const {
            data: { data: dessertPizza },
          } = await Api(
            `/categories/products?id=${DESSERT_PIZZA_ID}&store_id=${restaurantId}`
          );
          setDessertPizza(dessertPizza);

          AsyncStorage.setItem("dessertPizza", JSON.stringify(dessertPizza));

          const {
            data: { data: sidekicks },
          } = await Api(
            `/categories/products?id=${SIDEKICKS}&store_id=${restaurantId}`
          );
          setSidekicks(sidekicks);

          AsyncStorage.setItem("sidekicks", JSON.stringify(sidekicks));
        } catch (e) {
          console.log(e);
        }
      }
    };

    fetchClassicPizzas();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("classicPizza").then((res) => {
      const pizzas = JSON.parse(res);
      setPizzas(pizzas);
    });
  }, [classicPizza]);

  const [pizzas, setPizzas] = useState([]);
  const [pizza1, setPizza1] = useState("");
  const [pizza2, setPizza2] = useState("");
  const [pizza3, setPizza3] = useState("");
  const [pizza4, setPizza4] = useState("");
  const [pizza5, setPizza5] = useState("");
  const [pizza6, setPizza6] = useState("");
  const [crustType, setCrustType] = useState("Traditional Crust");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [pizza1Toppings, setPizza1Toppings] = useState([]);
  const [pizza2Toppings, setPizza2Toppings] = useState([]);
  const [pizza3Toppings, setPizza3Toppings] = useState([]);
  const [pizza4Toppings, setPizza4Toppings] = useState([]);
  const [pizza5Toppings, setPizza5Toppings] = useState([]);
  const [pizza6Toppings, setPizza6Toppings] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showToppingModal, setShowToppingModal] = useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [freePizzas, setFreePizzas] = React.useState([]);
  const [openPizzaVisible, setOpenPizzaVisible] = React.useState(false);
  const [openPizza1Visible, setOpenPizza1Visible] = React.useState(false);
  const [openPizza2Visible, setOpenPizza2Visible] = React.useState(false);
  const [openPizza3Visible, setOpenPizza3Visible] = React.useState(false);
  const [openPizza4Visible, setOpenPizza4Visible] = React.useState(false);
  const [openPizza5Visible, setOpenPizza5Visible] = React.useState(false);
  const [openPizza6Visible, setOpenPizza6Visible] = React.useState(false);

  const selectItems = pizzas
    ?.map((product) => ({
      ...product,
      label: product.name,
      value: product.name,
    }))
    ?.filter((product) => !product.name.includes("Two Sides"));

  const mediumFreeItems = freePizzas
    ?.filter((pizza) => pizza.type === "medium")
    ?.map((product) => ({
      label: product.product.productname,
      value: product.product.productname,
    }));

  const largeFreeItems = freePizzas
    ?.filter((pizza) => pizza.type === "large")
    ?.map((product) => ({
      label: product.product.productname,
      value: product.product.productname,
    }));

  useEffect(() => {
    const fetchFreePizzas = async () => {
      try {
        const {
          data: { pizzas },
        } = await Api.get("free-pizzas");
        setFreePizzas(pizzas);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFreePizzas();
  }, []);

  const onToggleTopping = (selectedToppings, pizzaIndex) => {
    if (pizzaIndex === 1) {
      setPizza1Toppings(selectedToppings);
    } else if (pizzaIndex === 2) {
      setPizza2Toppings(selectedToppings);
    } else if (pizzaIndex === 3) {
      setPizza3Toppings(selectedToppings);
    } else if (pizzaIndex === 4) {
      setPizza4Toppings(selectedToppings);
    } else if (pizzaIndex === 5) {
      setPizza5Toppings(selectedToppings);
    } else if (pizzaIndex === 6) {
      setPizza6Toppings(selectedToppings);
    }
  };

  const joinPizzaToppings = () => {
    const pizza1id = pizzas?.find((pizza) => pizza.name === pizza1)?.id;
    const pizza2id = pizzas?.find((pizza) => pizza.name === pizza2)?.id;
    const pizza3id = pizzas?.find((pizza) => pizza.name === pizza3)?.id;
    const pizza4id = pizzas?.find((pizza) => pizza.name === pizza4)?.id;
    const pizza5id = pizzas?.find((pizza) => pizza.name === pizza5)?.id;
    const pizza6id = pizzas?.find((pizza) => pizza.name === pizza6)?.id;
    const mappedP1Toppings = pizza1Toppings?.map((topping) => ({
      id: topping.id,
      price: topping.price,
      product_id: pizza1id,
      name: topping.topping_name,
      parent_topping: topping.parent_topping,
    }));
    const mappedP2Toppings = pizza2Toppings?.map((topping) => ({
      id: topping.id,
      price: topping.price,
      product_id: pizza2id,
      name: topping.topping_name,
      parent_topping: topping.parent_topping,
    }));
    const mappedP3Toppings = pizza3Toppings?.map((topping) => ({
      id: topping.id,
      price: topping.price,
      product_id: pizza3id,
      name: topping.topping_name,
      parent_topping: topping.parent_topping,
    }));
    const mappedP4Toppings = pizza4Toppings?.map((topping) => ({
      id: topping.id,
      price: topping.price,
      product_id: pizza4id,
      name: topping.topping_name,
      parent_topping: topping.parent_topping,
    }));
    const mappedP5Toppings = pizza5Toppings?.map((topping) => ({
      id: topping.id,
      price: topping.price,
      product_id: pizza5id,
      name: topping.topping_name,
      parent_topping: topping.parent_topping,
    }));
    const mappedP6Toppings = pizza6Toppings?.map((topping) => ({
      id: topping.id,
      price: topping.price,
      product_id: pizza6id,
      name: topping.topping_name,
      parent_topping: topping.parent_topping,
    }));

    return [
      ...mappedP1Toppings,
      ...mappedP2Toppings,
      ...mappedP3Toppings,
      ...mappedP4Toppings,
      ...mappedP5Toppings,
      ...mappedP6Toppings,
    ];
  };

  const addToCartHandler = () => {
    const allToppings = joinPizzaToppings();

    const productPrice = +deal.sizes[0].price.price;
    let totalPrice =
      allToppings.length > 0
        ? allToppings
            ?.map((topping) => (topping.price ? +topping.price : 0))
            .reduce((a, b) => a + b)
        : 0;
    const subtotal = totalPrice + productPrice;
    totalPrice = subtotal * quantity;

    addItemToCart(
      dispatch,
      cart,
      deal,
      quantity,
      subtotal,
      totalPrice,
      productPrice,
      pizza1,
      pizza2,
      crustType,
      deal.sizes[0].size.size_type,
      allToppings,
      "deal",
      () => setModalVisible(true),
      pizza3,
      pizza4,
      pizza5,
      pizza6
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
            <MyText title={deal.name} style={s.name} />
            <MyText title={deal.description} style={s.description} />

            <CrustSelector cb={(value) => setCrustType(value)} />

            <Image style={s.pizzaImage} source={PizzaJungle} />

            {deal.name !== "Party Deal" && (
              <>
                <>
                  <TouchableOpacity
                    onPress={() => setOpenPizza1Visible(true)}
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
                      {pizza1
                        ? `1st Pizza  - ${pizza1} - Large Pizza `
                        : "select Large Pizza"}
                    </Text>
                  </TouchableOpacity>
                  <RNModalSelect
                    items={selectItems}
                    itemLabelFieldName="label"
                    enableSearch={true}
                    title="1st Pizza"
                    showSelect={openPizza1Visible}
                    onItemSelected={(value) => setPizza1(value.value)}
                    onClose={() => setOpenPizza1Visible(false)}
                  />
                </>

                {console.log(pizza1)}
                {/* <PizzaSelector
                  placeholder={"Large Pizza"}
                  title='1st Pizza'
                  cb={(value) => setPizza1(value)}
                  items={selectItems}
                  selectStyle={{ width: "70%" }}
                /> */}

                <AddedToppings toppings={pizza1Toppings} />

                <CustomButton
                  style={s.addTopping}
                  textStyle={{ color: "white" }}
                  title="Add topping"
                  onPress={() => setShowToppingModal(1)}
                />

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
                      {pizza2
                        ? `2nd pizza - ${pizza2} - Medium Free`
                        : "Select Medium Free Pizza"}
                    </Text>
                  </TouchableOpacity>
                  <RNModalSelect
                    items={mediumFreeItems}
                    itemLabelFieldName="label"
                    enableSearch={true}
                    title="2nd Pizza"
                    showSelect={openPizzaVisible}
                    onItemSelected={(value) => setPizza2(value.value)}
                    onClose={() => setOpenPizzaVisible(false)}
                  />
                </>

                <AddedToppings toppings={pizza2Toppings} />

                <CustomButton
                  style={s.addTopping}
                  textStyle={{ color: "white" }}
                  title="Add topping"
                  onPress={() => setShowToppingModal(2)}
                />
              </>
            )}

            {deal.name === "Party Deal" && (
              <>
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
                      {pizza1
                        ? `1st Pizza ${pizza1} - Large Pizza `
                        : "Select 1st Large Pizza"}
                    </Text>
                  </TouchableOpacity>
                  <RNModalSelect
                    items={selectItems}
                    itemLabelFieldName="label"
                    enableSearch={true}
                    title="1st Pizza"
                    showSelect={openPizzaVisible}
                    onItemSelected={(value) => setPizza1(value.value)}
                    onClose={() => setOpenPizzaVisible(false)}
                  />
                </>
                {/* <PizzaSelector
                  placeholder={"Select Large Pizza"}
                  title='1st Pizza'
                  cb={(value) => setPizza1(value)}
                  items={selectItems}
                  selectStyle={{ width: "70%" }}
                /> */}

                <AddedToppings toppings={pizza1Toppings} />

                <CustomButton
                  style={s.addTopping}
                  textStyle={{ color: "white" }}
                  title="Add topping"
                  onPress={() => setShowToppingModal(1)}
                />

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
                      {pizza2
                        ? `2nd Pizza ${pizza2} - Large Pizza `
                        : "Select 2nd Large Pizza"}
                    </Text>
                  </TouchableOpacity>
                  <RNModalSelect
                    items={selectItems}
                    itemLabelFieldName="label"
                    enableSearch={true}
                    title="2nd Pizza"
                    showSelect={openPizza2Visible}
                    onItemSelected={(value) => setPizza2(value.value)}
                    onClose={() => setOpenPizza2Visible(false)}
                  />
                </>
                {/* <PizzaSelector
                  placeholder={"Select Large Pizza"}
                  title='2nd Pizza'
                  cb={(value) => setPizza2(value)}
                  items={selectItems}
                  selectStyle={{ width: "70%" }}
                /> */}

                <AddedToppings toppings={pizza2Toppings} />

                <CustomButton
                  style={s.addTopping}
                  textStyle={{ color: "white" }}
                  title="Add topping"
                  onPress={() => setShowToppingModal(2)}
                />

                <>
                  <TouchableOpacity
                    onPress={() => setOpenPizza3Visible(true)}
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
                      {pizza3
                        ? `3rd Pizza ${pizza3} - Large Pizza `
                        : "Select 3rd Large Pizza"}
                    </Text>
                  </TouchableOpacity>
                  <RNModalSelect
                    items={selectItems}
                    itemLabelFieldName="label"
                    enableSearch={true}
                    title="3rd Pizza"
                    showSelect={openPizza3Visible}
                    onItemSelected={(value) => setPizza3(value.value)}
                    onClose={() => setOpenPizza3Visible(false)}
                  />
                </>

                {/* <PizzaSelector
                  placeholder={"Select Large Pizza"}
                  title='3rd Pizza'
                  cb={(value) => setPizza3(value)}
                  items={selectItems}
                  selectStyle={{ width: "70%" }}
                /> */}

                <AddedToppings toppings={pizza3Toppings} />

                <CustomButton
                  style={s.addTopping}
                  textStyle={{ color: "white" }}
                  title="Add topping"
                  onPress={() => setShowToppingModal(3)}
                />

                {/* <PizzaSelector
                  placeholder={"Select Large Pizza"}
                  title='4th Pizza'
                  cb={(value) => setPizza4(value)}
                  items={selectItems}
                  selectStyle={{ width: "70%" }}
                /> */}

                <>
                  <TouchableOpacity
                    onPress={() => setOpenPizza4Visible(true)}
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
                      {pizza4
                        ? `4th Pizza ${pizza4} - Large Pizza `
                        : "Select 4th Large Pizza"}
                    </Text>
                  </TouchableOpacity>
                  <RNModalSelect
                    items={selectItems}
                    itemLabelFieldName="label"
                    enableSearch={true}
                    title="4th Pizza"
                    showSelect={openPizza4Visible}
                    onItemSelected={(value) => setPizza4(value.value)}
                    onClose={() => setOpenPizza4Visible(false)}
                  />
                </>

                <AddedToppings toppings={pizza4Toppings} />

                <CustomButton
                  style={s.addTopping}
                  textStyle={{ color: "white" }}
                  title="Add topping"
                  onPress={() => setShowToppingModal(4)}
                />

                {/* <PizzaSelector
                  placeholder={"Select Large Pizza"}
                  title='5th Pizza'
                  cb={(value) => setPizza5(value)}
                  items={selectItems}
                  selectStyle={{ width: "70%" }}
                /> */}

                <>
                  <TouchableOpacity
                    onPress={() => setOpenPizza5Visible(true)}
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
                      {pizza5
                        ? `5th Pizza ${pizza5} - Large Pizza `
                        : "Select 5th Large Pizza"}
                    </Text>
                  </TouchableOpacity>
                  <RNModalSelect
                    items={selectItems}
                    itemLabelFieldName="label"
                    enableSearch={true}
                    title="5th Pizza"
                    showSelect={openPizza5Visible}
                    onItemSelected={(value) => setPizza5(value.value)}
                    onClose={() => setOpenPizza5Visible(false)}
                  />
                </>
                <AddedToppings toppings={pizza5Toppings} />

                <CustomButton
                  style={s.addTopping}
                  textStyle={{ color: "white" }}
                  title="Add topping"
                  onPress={() => setShowToppingModal(5)}
                />
                <>
                  <TouchableOpacity
                    onPress={() => setOpenPizza6Visible(true)}
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
                      {pizza6
                        ? `6th Pizza ${pizza6} - Large Pizza `
                        : "Select 6th Large Pizza"}
                    </Text>
                  </TouchableOpacity>

                  <RNModalSelect
                    items={selectItems}
                    itemLabelFieldName="label"
                    enableSearch={true}
                    title="6th Pizza"
                    showSelect={openPizza6Visible}
                    onItemSelected={(value) => setPizza6(value.value)}
                    onClose={() => setOpenPizza6Visible(false)}
                  />
                </>
                {/* <PizzaSelector
                  placeholder={"Select Free Pizza"}
                  title='6th Pizza'
                  cb={(value) => setPizza6(value)}
                  items={largeFreeItems}
                  selectStyle={{ width: "70%" }}
                /> */}

                <AddedToppings toppings={pizza6Toppings} />

                <CustomButton
                  style={s.addTopping}
                  textStyle={{ color: "white" }}
                  title="Add topping"
                  onPress={() => setShowToppingModal(6)}
                />
              </>
            )}

            {deal.name !== "Party Deal" && (
              <QuantityInput
                style={{ marginBottom: 10 }}
                callback={(value) => setQuantity(+value)}
              />
            )}

            <View style={s.cartButtons}>
              <CustomButton
                disabled={
                  !selectedToppings.length && deal.name === "Party Deal"
                    ? !pizza1 ||
                      !pizza2 ||
                      !pizza3 ||
                      !pizza4 ||
                      !pizza5 ||
                      !pizza6
                    : !pizza1 || !pizza2
                }
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
        currentToppingModal={showToppingModal}
        showModal={showToppingModal === 1}
        pizzaNo={showToppingModal}
        onCloseModal={() => setShowToppingModal(false)}
        onToggleTopping={onToggleTopping}
      />

      <AddToppingModal
        currentToppingModal={showToppingModal}
        showModal={showToppingModal === 2}
        pizzaNo={showToppingModal}
        onCloseModal={() => setShowToppingModal(false)}
        onToggleTopping={onToggleTopping}
      />

      <AddToppingModal
        currentToppingModal={showToppingModal}
        showModal={showToppingModal === 3}
        pizzaNo={showToppingModal}
        onCloseModal={() => setShowToppingModal(false)}
        onToggleTopping={onToggleTopping}
      />

      <AddToppingModal
        currentToppingModal={showToppingModal}
        showModal={showToppingModal === 4}
        pizzaNo={showToppingModal}
        onCloseModal={() => setShowToppingModal(false)}
        onToggleTopping={onToggleTopping}
      />

      <AddToppingModal
        currentToppingModal={showToppingModal}
        showModal={showToppingModal === 5}
        pizzaNo={showToppingModal}
        onCloseModal={() => setShowToppingModal(false)}
        onToggleTopping={onToggleTopping}
      />

      <AddToppingModal
        currentToppingModal={showToppingModal}
        showModal={showToppingModal === 6}
        pizzaNo={showToppingModal}
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
  pizzaImage: {
    width: 170,
    height: 170,
    marginVertical: 20,
  },
});
