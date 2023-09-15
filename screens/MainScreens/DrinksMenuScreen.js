import { FlatList, View, StyleSheet, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import MyText from "../../components/UI/MyText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SingleDrinkMenuCard from "../../components/UI/SingleDrinkMenuCard";
import Api from "../../helpers/axios";
import { DRINK_ID } from "../../helpers/constants";

export default ({ navigation }) => {
  const [activeDrink, setActiveDrink] = React.useState(null);

  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("drinks").then((res) => {
      if (res) {
        const drinks = JSON.parse(res);
        setDrinks(drinks);
      }
    });

    const fetchDrinks = async () => {
      const store = await AsyncStorage.getItem("selectedStore");
      if (store) {
        const restaurant = JSON.parse(store);
        const restaurantId = restaurant.id;
        try {
          const {
            data: { data: drinks },
          } = await Api(
            `/categories/products?id=${DRINK_ID}&store_id=${restaurantId}`
          );
          const filteredDrinks = drinks.filter(
            (drink) => drink.sizes.length > 0
          );
          setDrinks(filteredDrinks);

          AsyncStorage.setItem("drinks", JSON.stringify(filteredDrinks));
        } catch (e) {
          console.log(e);
        }
      }
    };

    fetchDrinks();
  }, []);

  const onPressHandler = (id) => {
    setActiveDrink(id);
    const drink = drinks.find((drink) => drink.id === id);
    navigation.navigate("Drink", { drink });
  };

  const Drink = (drink) => (
    <SingleDrinkMenuCard
      drink={drink}
      onPressHandler={() => {
        if (drink.price) {
          onPressHandler(drink.id);
        } else {
          Alert.alert("", "Product is not available");
        }
      }}
    />
  );

  return (
    <>
      <View>
        <FlatList
          style={s.flatListContainer}
          contentContainerStyle={s.list}
          keyExtractor={(item) => item.id.toString()}
          data={drinks}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <Drink
                id={item.id}
                image={item.image}
                name={item.name}
                isNew={item.is_new}
                price={item.sizes[0]?.price.price || 0}
                productimage={item.productimage}
              />
            );
          }}
        />

        <ScreenHeader
          hasBackButtonAlt
          hasNavigationDrawerIcon={false}
          title="DRINKS"
          color={Colors.primaryColor}
          navigation={navigation}
        />
      </View>
    </>
  );
};

const s = StyleSheet.create({
  drink: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 7,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 2,
  },
  drinkImageContainer: {
    alignItems: "center",
  },
  drinkImage: {
    width: 60,
    height: 120,
  },
  drinkTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontFamily: "GilroyBold",
    fontSize: 16,
    textAlign: "center",
  },
  drinkPrice: {
    fontFamily: "GilroyBold",
    fontSize: 16,
    color: Colors.lightGrey,
  },
  flatListContainer: {},
  list: {
    marginTop: 150,
    paddingHorizontal: 20,
    paddingBottom: 200,
  },
});
