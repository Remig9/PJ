import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import MyText from "../../components/UI/MyText";
import RadioButton from "../../components/UI/RadioButton";
import CustomButton from "../../components/UI/CustomButton";
import AuthHeader from "../../assets/img/auth-header.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../helpers/axios";
import { deleteAllCart } from "../../db/databaseTransactions";
import { syncAndDeleteCart } from "../../store/actions/cart";
import { useDispatch } from "react-redux";
import RNModalSelect from "rn-awesome-select";

const StoreSelection = ({ navigation }) => {
  const [token, setToken] = useState();
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantVisible, setRestaurantVisible] = useState(false);
  const [stateVisible, setStateVisible] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [state, setState] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStates = async () => {
      const token = await AsyncStorage.getItem("token");
      setToken(token);

      try {
        const {
          data: { data },
        } = await Api.get("restaurants/get-all-locations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cities = data.map(({ city }) => ({ name: city, value: city }));

        setCities(cities);
      } catch (e) {
        console.log(e);
      }
    };

    fetchStates();
  }, []);

  const fetchRestaurants = async (state) => {
    if (!state) return;
    setRestaurants([]);
    setSelectedRestaurantId(null);
    try {
      // const {
      //   data: { data },
      // } = await Api.post(
      //   "restaurants/get-by-state",
      //   { state: state.value },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      const {
        data: { data },
      } = await Api.post(
        "restaurants/get-by-location",
        { city: state },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(state.value, "RESTAURANT");
      const restaurants = data.map((restaurant) => ({
        ...restaurant,
        label: restaurant.store_name,
        value: restaurant.id,
      }));
      setRestaurants(restaurants);
    } catch (e) {
      console.log(e);
    }
  };

  const onRestaurantSelected = async (restaurantID) => {
    setSelectedRestaurantId(restaurantID);
    if (!restaurantID) return;
    const selectedRestaurant = restaurants.find(
      (restaurant) => restaurant.id === restaurantID
    );
    await AsyncStorage.setItem(
      "selectedStore",
      JSON.stringify(selectedRestaurant)
    );
  };

  const continueHandler = async () => {
    await AsyncStorage.setItem("deliveryType", deliveryType);
    await deleteAllCart();
    dispatch(syncAndDeleteCart());
    navigation.navigate("Home");
  };

  return (
    <>
      <ScrollView style={s.container}>
        <View style={s.viewContainer}>
          <MyText
            title="Kindly pick a restaurant closest to your pickup/delivery address"
            h2
            style={{ color: "white", marginBottom: 20, lineHeight: 28 }}
          />

          <MyText
            title="Note: The pickup instore option would require online payment."
            h5
            style={{ color: "#8DC63F", marginBottom: 20, lineHeight: 28 }}
          />

          <View style={{ width: "100%" }}>
            {/* {console.log(cities)} */}

            {cities && (
              <>
                <TouchableOpacity
                  onPress={() => setStateVisible(true)}
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
                    {state ? state.name : "Select Cities"}
                  </Text>
                </TouchableOpacity>
                <RNModalSelect
                  items={cities}
                  itemLabelFieldName="name"
                  enableSearch={true}
                  title="Select  Cities"
                  showSelect={stateVisible}
                  onItemSelected={(item) => {
                    setState(item);
                    fetchRestaurants(item);
                  }}
                  onClose={() => setStateVisible(false)}
                />
              </>
            )}

            {restaurants && state && (
              <>
                <TouchableOpacity
                  onPress={() => setRestaurantVisible(true)}
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
                    {restaurant ? restaurant.store_name : "Select Resturants"}
                  </Text>
                </TouchableOpacity>
                <RNModalSelect
                  items={restaurants}
                  itemLabelFieldName="store_name"
                  enableSearch={true}
                  title="Select Restuarants"
                  showSelect={restaurantVisible}
                  onItemSelected={(item) => {
                    onRestaurantSelected(item.id);
                    setRestaurant(item);
                  }}
                  onClose={() => setRestaurantVisible(false)}
                />
              </>
            )}
          </View>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <RadioButton
              onPress={() => setDeliveryType("pickup")}
              checked={deliveryType === "pickup" ? "checked" : "unchecked"}
              radioKey="pickup"
              value="pickup"
              title="PICKUP INSTORE"
              labelStyle={s.radioLabelStyle}
            />

            <RadioButton
              onPress={() => setDeliveryType("delivery")}
              checked={deliveryType === "delivery" ? "checked" : "unchecked"}
              radioKey="delivery"
              value="delivery"
              title="DELIVERY"
              labelStyle={s.radioLabelStyle}
            />
          </View>

          <CustomButton
            disabled={!selectedRestaurantId}
            onPress={continueHandler}
            title="CONTINUE"
            style={s.buttonStyle}
            textStyle={{ color: Colors.primaryColor, fontSize: 17 }}
          />
        </View>
      </ScrollView>

      <ScreenHeader
        hasBackButton
        hasNavigationDrawerIcon={false}
        title="SELECT A STORE"
        color={Colors.primaryColor}
        navigation={navigation}
        backgroundColor="white"
      />

      <View style={s.bottomContainer}>
        <ImageBackground source={AuthHeader} style={s.backgroundImage} />
      </View>
    </>
  );
};

export default StoreSelection;

const s = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryColor,
    height: "80%",
  },
  viewContainer: {
    paddingHorizontal: 30,
    marginTop: 200,
  },
  radioLabelStyle: {
    color: "white",
    fontSize: 18,
    fontFamily: "GilroyRegular",
  },
  buttonStyle: {
    backgroundColor: "white",
    width: "60%",
    marginTop: 50,
  },
  bottomContainer: {
    height: 50,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "contain",
    alignItems: "center",
  },
});
