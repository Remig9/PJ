import Colors from "../../constants/Colors";
import {Image, Pressable, StyleSheet, View} from "react-native";
import MyText from "./MyText";
import React from "react";
import NewTag from "../../assets/img/new-tag.png";

export default ({drink: {id, name, price, productimage, isNew}, activeDrink, onPressHandler}) => {
    return <Pressable
        onPress={() => onPressHandler(id)}
        style={{...s.drink, borderColor: activeDrink === id ? Colors.primaryColor : 'transparent'}}
    >
        {isNew && <Image style={s.newTag} source={NewTag} />}

        <View style={s.drinkImageContainer}>
            <Image style={s.drinkImage} source={{uri: productimage}} />
        </View>

        <MyText style={s.drinkTitle} title={name} />
        <MyText style={s.drinkPrice} title={`₦${price}`} />
    </Pressable>
}

const s = StyleSheet.create({
    drink: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 7,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 4,
        borderWidth: 2
    },
    drinkImageContainer: {
        alignItems: 'center',
    },
    drinkImage: {
        width: 60,
        height: 120
    },
    drinkTitle: {
        marginTop: 15,
        marginBottom: 10,
        fontFamily: 'GilroyBold',
        fontSize: 16,
        textAlign: 'center'
    },
    drinkPrice: {
        fontFamily: 'GilroyBold',
        fontSize: 16,
        color: Colors.lightGrey
    },
    newTag: {
        position: 'absolute',
        right: 0
    }
})
