import {Image, StyleSheet} from "react-native";
import checkImage from "../../assets/img/check-cart.png";
import MyText from "./MyText";
import CustomButton from "./CustomButton";
import Modal from "./Modal";
import React from "react";
import Colors from "../../constants/Colors";

export default ({modalVisible, continueHandler, cartHandler}) => <Modal modalVisible={modalVisible}>
    <Image source={checkImage} style={s.modalImage}/>

    <MyText title="Added to cart" style={s.modalText} h3/>

    <CustomButton title="Continue Ordering" style={s.continueOrdering}
                  textStyle={s.continueOrderingText} onPress={continueHandler}/>
    <CustomButton
        title="Go to Cart"
        style={{...s.goToCart, justifyContent: 'center'}}
        textStyle={s.goToCartText}
        onPress={cartHandler}
    />

</Modal>

const s = StyleSheet.create({
    modalImage: {
        width: 100,
        height: 100
    },
    modalText: {
        marginTop: 20,
        marginBottom: 30,
        fontFamily: 'GilroyBlack',
        fontSize: 19,
        color: Colors.gold
    },
    continueOrdering: {
        backgroundColor: Colors.lightGreen
    },
    continueOrderingText: {
        color: 'white',
        fontSize: 14
    },
    goToCart: {
        backgroundColor: Colors.light,
        marginTop: 15
    },
    goToCartText: {
        color: 'black',
        fontSize: 14
    }
});
