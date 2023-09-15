import { View, StyleSheet, Image, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import MyText from "../../components/UI/MyText";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import { deals } from "../../models/deals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NewTag from "../../assets/img/new-tag.png";
import Api from "../../helpers/axios";
import { DEALS_ID } from "../../helpers/constants";

export default ({ navigation }) => {
  const [Deals, setDeals] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("deals").then((res) => {
      if (res) {
        const deals = JSON.parse(res);
        setDeals(deals);
      }
    });

    const fetchDeals = async () => {
      const store = await AsyncStorage.getItem("selectedStore");
      if (store) {
        const restaurant = JSON.parse(store);
        const restaurantId = restaurant.id;

        try {
          const {
            data: { data: deals },
          } = await Api(
            `/categories/products?id=${DEALS_ID}&store_id=${restaurantId}`
          );
          console.log(deals, "DEALS");
          const filteredDeals = deals.filter((drink) => drink.sizes.length > 0);
          setDeals(filteredDeals);

          AsyncStorage.setItem("deals", JSON.stringify(filteredDeals));
        } catch (e) {
          console.log(e);
        }
      }
    };

    fetchDeals();
  }, []);

  const onNavigate = (deal) => {
    if (deal.is_discount === 1) {
      return navigation.navigate("SinglePromoDeal", { deal });
    }
    navigation.navigate("SingleDeal", { deal });
  };

  const Deal = ({ deal }) => (
    <Pressable onPress={() => onNavigate(deal)} style={s.deal}>
      {deal.is_new && <Image style={s.newTag} source={NewTag} />}

      <Image source={{ uri: deal.productimage }} style={s.dealImage} />

      <MyText title={deal.name} style={s.dealTitle} />

      <MyText title={deal.description} style={s.dealDescription} />
      <View style={s.priceContainer}>
        <MyText
          title={`₦${deal.sizes[0]?.price?.price}`}
          style={[s.price, deal.salePrice ? s.priceWithSale : null]}
        />
        {deal.salePrice && (
          <MyText title={`₦${deal.salePrice}`} style={s.salePrice} />
        )}
      </View>
    </Pressable>
  );

  return (
    <>
      <View>
        <FlatList
          style={s.flatListContainer}
          contentContainerStyle={s.list}
          keyExtractor={(item) => item.id.toString()}
          data={Deals}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <Deal deal={item} />}
        />

        <ScreenHeader
          hasNavigationDrawerIcon={false}
          hasBackButtonAlt
          title="DEALS"
          color={Colors.primaryColor}
          navigation={navigation}
        />
      </View>
    </>
  );
};

const s = StyleSheet.create({
  deal: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 30,
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
  dealImage: {
    width: "100%",
    height: 130,
    marginBottom: 20,
  },
  dealTitle: {
    fontFamily: "GilroyBold",
    fontSize: 15,
    marginBottom: 10,
  },
  dealDescription: {
    fontFamily: "GilroyLight",
    lineHeight: 20,
    fontSize: 12,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  price: {
    fontFamily: "GilroyLight",
    fontSize: 15,
    marginLeft: 15,
  },
  salePrice: {
    fontFamily: "GilroyLight",
    fontSize: 15,
    marginLeft: 15,
  },
  priceWithSale: {
    textDecorationLine: "line-through",
    textDecorationColor: "red",
  },
  flatListContainer: {},
  list: {
    marginTop: 130,
    paddingHorizontal: 30,
    paddingBottom: 200,
  },
  newTag: {
    position: "absolute",
    right: 0,
  },
});
