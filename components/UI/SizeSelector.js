import { Image, Pressable, View, StyleSheet } from "react-native";
import PizzaImageActive from "../../assets/img/pizza-size-image-active.png";
import PizzaImageInactive from "../../assets/img/pizza-size-image-inactive.png";
import MyText from "./MyText";
import React from "react";
import Colors from "../../constants/Colors";
import CheckIcon from "../../assets/img/check-icon.png";

export default ({
  label1 = "Large",
  label2 = "Medium",
  label3 = "Small",
  price1 = 4000,
  price2 = 2500,
  price3 = 1000,
  cb = null,
  containerStyle = {},
  hasSmallSize = false,
}) => {
  const [pizzaSizeIndex, setPizzaSizeIndex] = React.useState(0);

  const SizeActive = () => (
    <View style={s.sizeActiveContainer}>
      <Image source={CheckIcon} style={s.sizeCheck} />
    </View>
  );

  const setPizzaSizeHandler = (index) => {
    setPizzaSizeIndex(index);
    cb
      ? cb(
          index === 0
            ? { size: label1, price: price1 }
            : index === 1
            ? { size: label2, price: price2 }
            : { size: label3, price: price3 }
        )
      : null;
  };

  React.useEffect(() => {
    if (price1 > 0) {
      setPizzaSizeHandler(0);
    } else if (price2 > 0) {
      setPizzaSizeHandler(1);
    } else if (price3 > 0) {
      setPizzaSizeHandler(2);
    }
  }, []);

  return (
    <View style={[s.pizzaSizes, containerStyle]}>
      {price1 > 0 && (
        <Pressable
          onPress={() => setPizzaSizeHandler(0)}
          style={[s.pizzaSize, pizzaSizeIndex === 0 ? s.pizzaSizeActive : null]}
        >
          {pizzaSizeIndex === 0 && <SizeActive />}
          <View style={s.pizzaSizeImageContainer}>
            <Image
              source={
                pizzaSizeIndex === 0 ? PizzaImageActive : PizzaImageInactive
              }
              style={
                pizzaSizeIndex === 0 ? s.pizzaImageActive : s.pizzaImageInactive
              }
            />
          </View>
          {price1 && (
            <View style={s.pizzaSizeLabelContainer}>
              <MyText
                title={label1}
                style={[
                  s.pizzaSizeLabel,
                  pizzaSizeIndex === 0
                    ? s.pizzaSizeLabelActive
                    : s.pizzaSizeLabelInactive,
                ]}
              />
              <MyText
                title={`₦${Math.trunc(+price1)}`}
                style={[
                  s.pizzaSizeLabel,
                  pizzaSizeIndex === 0
                    ? s.pizzaSizePriceActive
                    : s.pizzaSizePriceInactive,
                ]}
              />
            </View>
          )}
        </Pressable>
      )}

      {price2 > 0 && (
        <Pressable
          onPress={() => setPizzaSizeHandler(1)}
          style={[s.pizzaSize, pizzaSizeIndex === 1 ? s.pizzaSizeActive : null]}
        >
          {pizzaSizeIndex === 1 && <SizeActive />}
          <View style={s.pizzaSizeImageContainer}>
            <Image
              source={
                pizzaSizeIndex === 1 ? PizzaImageActive : PizzaImageInactive
              }
              style={
                pizzaSizeIndex === 1 ? s.pizzaImageActive : s.pizzaImageInactive
              }
            />
          </View>
          <View style={s.pizzaSizeLabelContainer}>
            <MyText
              title={label2}
              style={[
                s.pizzaSizeLabel,
                pizzaSizeIndex === 1
                  ? s.pizzaSizeLabelActive
                  : s.pizzaSizeLabelInactive,
              ]}
            />
            <MyText
              title={`₦${Math.trunc(+price2)}`}
              style={[
                s.pizzaSizeLabel,
                pizzaSizeIndex === 1
                  ? s.pizzaSizePriceActive
                  : s.pizzaSizePriceInactive,
              ]}
            />
          </View>
        </Pressable>
      )}

      {price3 > 0 && (
        <Pressable
          onPress={() => setPizzaSizeHandler(2)}
          style={[s.pizzaSize, pizzaSizeIndex === 2 ? s.pizzaSizeActive : null]}
        >
          {pizzaSizeIndex === 2 && <SizeActive />}
          <View style={s.pizzaSizeImageContainer}>
            <Image
              source={
                pizzaSizeIndex === 2 ? PizzaImageActive : PizzaImageInactive
              }
              style={
                pizzaSizeIndex === 2 ? s.pizzaImageActive : s.pizzaImageInactive
              }
            />
          </View>
          <View style={s.pizzaSizeLabelContainer}>
            <MyText
              title={label3}
              style={[
                s.pizzaSizeLabel,
                pizzaSizeIndex === 2
                  ? s.pizzaSizeLabelActive
                  : s.pizzaSizeLabelInactive,
              ]}
            />
            <MyText
              title={`₦${Math.trunc(+price3)}`}
              style={[
                s.pizzaSizeLabel,
                pizzaSizeIndex === 2
                  ? s.pizzaSizePriceActive
                  : s.pizzaSizePriceInactive,
              ]}
            />
          </View>
        </Pressable>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  pizzaSizes: {
    flexDirection: "row",
    marginLeft: -5,
    marginRight: -5,
  },
  pizzaSize: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    margin: 5,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  pizzaSizeActive: {
    borderColor: Colors.primaryColor,
    borderWidth: 2,
  },
  pizzaSizeImageContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 20,
  },
  pizzaImageActive: {
    width: 60,
    height: 60,
  },
  pizzaImageInactive: {
    width: 40,
    height: 40,
  },
  pizzaSizeLabelContainer: {
    alignItems: "center",
  },
  pizzaSizeLabel: {
    fontFamily: "GilroyBold",
    fontSize: 17,
    letterSpacing: 3,
    marginBottom: 5,
  },
  pizzaSizeLabelActive: {},
  pizzaSizePriceActive: {
    color: Colors.lightGreen,
  },
  pizzaSizeLabelInactive: {
    color: Colors.lightGrey,
  },
  pizzaSizePriceInactive: {
    color: Colors.lightGrey,
  },
  sizeActiveContainer: {
    backgroundColor: Colors.primaryColor,
    padding: 8,
    borderRadius: 100,
    position: "absolute",
    top: -10,
    right: -8,
  },
  sizeCheck: {
    width: 9,
    height: 9,
  },
});
