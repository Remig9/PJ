import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import MyText from "./MyText";
import React from "react";
import Colors from "../../constants/Colors";
import { firstCharacter, truncateString } from "../../services/typography";
import NewTag from "../../assets/img/new-tag.png";

const spacing = 5;
const width = (Dimensions.get("window").width - 40) / 2 - 10;

export default ({ item, navigation, carouselIndex }) => {
  const [activeCard, setActiveCard] = React.useState(false);

  const onPressHandler = () => {
    console.log(item.sizes.length);
    if (item.sizes.length) {
      if (carouselIndex === 3) {
        return navigation.navigate("SideKicksScreen", { item });
      }

      if (!item.name.includes("Two Sides")) {
        return navigation.navigate("IndividualScreen", { item });
      }

      if (carouselIndex === 0) {
        return navigation.navigate("TwoSidesIndividualClassicScreen", { item });
      }

      return navigation.navigate("TwoSidesIndividualSpecialScreen", { item });
    } else {
      Alert.alert("", "Product is not available");
    }
  };

  return (
    <Pressable
      onPress={onPressHandler}
      onPressIn={() => setActiveCard(true)}
      onPressOut={() => setActiveCard(false)}
      style={{
        ...s.pizzaCard,
        borderColor: activeCard ? Colors.primaryColor : "transparent",
      }}
    >
      {item.is_new && <Image style={s.newTag} source={NewTag} />}

      <Image style={s.pizzaImage} source={{ uri: item.productimage }} />

      <MyText style={s.pizzaTitle} title={item.name} />

      <MyText
        style={s.pizzaDescription}
        title={truncateString(item.description, 30)}
        p
      />

      {item.sizes.map((size) => (
        <View key={size.id} style={s.pizzaSizes}>
          <MyText
            title={`Size ${firstCharacter(size.size.size_type)}`}
            style={s.pizzaPriceLabel}
            p
          />
          <MyText
            title={`₦${Math.trunc(+size.price.price)}`}
            style={s.pizzaPrice}
            p
          />
        </View>
      ))}
    </Pressable>
  );
};

const s = StyleSheet.create({
  pizzaCard: {
    backgroundColor: "white",
    width: width,
    marginHorizontal: spacing,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    // height: 300,
    borderWidth: 2,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    alignItems: "center",
  },
  pizzaImage: {
    width: 116,
    height: 120,
  },
  pizzaTitle: {
    marginTop: 10,
    textAlign: "center",
    fontFamily: "GilroyBold",
    fontSize: 16,
  },
  pizzaDescription: {
    marginVertical: 10,
    textAlign: "center",
    lineHeight: 20,
    color: "#000000",
  },
  pizzaSizes: {
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    width: "100%",
  },
  pizzaPriceLabel: {
    color: "#000000",
  },
  pizzaPrice: {
    color: Colors.lightGreen,
    fontFamily: "GilroyBold",
  },
  newTag: {
    position: "absolute",
    right: 0,
  },
});
