import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import Carousel from "react-native-snap-carousel";
import SinglePizzaMenuCard from "../../components/UI/SinglePizzaMenuCard";
import MyText from "../../components/UI/MyText";
import PizzaJungle from "../../components/UI/PizzaJungle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../helpers/axios";
import {
  CLASSIC_PIZZA_ID,
  DESSERT_PIZZA_ID,
  SIDEKICKS,
  SPECIAL_PIZZA_ID,
} from "../../helpers/constants";

export default ({ navigation }) => {
  const [classicPizza, setClassicPizza] = useState([]);
  const [specialPizza, setSpecialPizza] = useState([]);
  const [dessertPizza, setDessertPizza] = useState([]);
  const [sidekicks, setSidekicks] = useState([]);
  // const [pizzaJungle, setPizzaJungle] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // let pizzas = [];
    AsyncStorage.getItem("classicPizza").then((res) => {
      if (res) {
        const classic = JSON.parse(res);
        setClassicPizza(classic);

        AsyncStorage.getItem("specialPizza").then((res) => {
          if (res) {
            const special = JSON.parse(res);
            setSpecialPizza(special);
            // pizzas = [...classic, ...special];
            // pizzas = pizzas.filter(p => !p.name.includes('Two Sides'))

            // setPizzaJungle(pizzas[Math.floor(Math.random() * pizzas.length)])

            AsyncStorage.getItem("dessertPizza").then((res) => {
              if (res) {
                const dessert = JSON.parse(res);
                setDessertPizza(dessert);
              }
            });

            AsyncStorage.getItem("sidekicks").then((res) => {
              if (res) {
                const sidekicks = JSON.parse(res);
                setSidekicks(sidekicks);
              }
            });
          }
        });
      }
    });

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

          // fetchedPizzas = [...classicPizza, ...specialPizza];
          // fetchedPizzas = fetchedPizzas.filter(p => !p.name.includes('Two Sides'))

          // setPizzaJungle(fetchedPizzas[Math.floor(Math.random() * fetchedPizzas.length)])

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
    const items = [
      {
        name: "Classic",
        products: classicPizza,
      },
      {
        name: "Special",
        products: specialPizza,
      },
      {
        name: "Dessert",
        products: dessertPizza,
      },
      {
        name: "Sidekicks",
        products: sidekicks,
      },
    ];
    setItems(items);
  }, [classicPizza, specialPizza, dessertPizza, sidekicks]);

  const [carouselRef, setCarouselRef] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderTo = (index) => {
    setActiveIndex(index);
    carouselRef.snapToItem(index, true, false);
  };

  const _renderItem = ({ item: carouselItem, index: carouselIndex }) => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <FlatList
        style={s.flatListContainer}
        contentContainerStyle={s.list}
        columnWrapperStyle={s.column}
        keyExtractor={(item) => item.id}
        data={carouselItem.products}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        renderItem={({ item, index }) => {
          return (
            <SinglePizzaMenuCard
              item={item}
              navigation={navigation}
              carouselIndex={carouselIndex}
            />
          );
        }}
      />
    </ScrollView>
  );

  return (
    <>
      <View style={s.container}>
        <View style={s.viewContainer}>
          <View style={s.menuSlider}>
            <Pressable onPress={() => sliderTo(0)}>
              <View style={s.menuSliderItem}>
                <MyText title="Classic" style={s.menuSliderText} />
                <View
                  style={[
                    s.menuSliderActive,
                    {
                      backgroundColor:
                        activeIndex === 0 ? Colors.gold : "transparent",
                    },
                  ]}
                />
              </View>
            </Pressable>

            <Pressable onPress={() => sliderTo(1)}>
              <View style={s.menuSliderItem}>
                <MyText title="Special" style={s.menuSliderText} />
                <View
                  style={[
                    s.menuSliderActive,
                    {
                      backgroundColor:
                        activeIndex === 1 ? Colors.gold : "transparent",
                    },
                  ]}
                />
              </View>
            </Pressable>

            <Pressable onPress={() => sliderTo(2)}>
              <View style={s.menuSliderItem}>
                <MyText title="Dessert" style={s.menuSliderText} />
                <View
                  style={[
                    s.menuSliderActive,
                    {
                      backgroundColor:
                        activeIndex === 2 ? Colors.gold : "transparent",
                    },
                  ]}
                />
              </View>
            </Pressable>

            <Pressable onPress={() => sliderTo(3)}>
              <View style={s.menuSliderItem}>
                <MyText title="PJ Sidekicks" style={s.menuSliderText} />
                <View
                  style={[
                    s.menuSliderActive,
                    {
                      backgroundColor:
                        activeIndex === 3 ? Colors.gold : "transparent",
                    },
                  ]}
                />
              </View>
            </Pressable>
          </View>

          <Carousel
            layout={"default"}
            ref={(c) => {
              setCarouselRef(c);
            }}
            data={items}
            firstItem={0}
            sliderWidth={Dimensions.get("window").width - 20}
            itemWidth={Dimensions.get("window").width - 20}
            renderItem={_renderItem}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
        </View>
      </View>

      <ScreenHeader
        title="PIZZA"
        hasBackButtonAlt={true}
        hasNavigationDrawerIcon={false}
        color={Colors.primaryColor}
        navigation={navigation}
      />
    </>
  );
};

const s = StyleSheet.create({
  container: {
    // height: '80%'
  },
  viewContainer: {
    marginTop: 180,
  },
  flatListContainer: {
    flex: 1,
    flexDirection: "column",
  },
  list: {
    marginLeft: 20,
    justifyContent: "space-around",
    marginBottom: 200,
  },
  column: {
    flexShrink: 1,
  },
  menuSlider: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginBottom: 20,
    marginTop: 25,
    borderBottomWidth: 3,
    borderColor: "#e3e3e3",
  },
  menuSliderItem: {
    // width: 90
  },
  menuSliderText: {
    marginBottom: 5,
    color: Colors.primaryColor,
    fontFamily: "GilroyBlack",
    fontSize: 15,
  },
  menuSliderActive: {
    height: 5,
    width: "100%",
  },
});
