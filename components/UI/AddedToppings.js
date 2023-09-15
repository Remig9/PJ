import {View, StyleSheet} from "react-native";
import MyText from "./MyText";
import React from "react";
import Colors from "../../constants/Colors";

const AddedToppings = ({toppings, heading = 'Toppings added'}) => {
    return <>
        {
            toppings.length > 0 && <View style={{width: '100%'}}>
                <MyText style={s.toppingHeader} title={heading}/>

                <View style={s.toppings}>
                    {
                        toppings.map(topping => <View key={topping.id}
                                                              style={s.singleToppingContainer}>
                            <MyText style={s.topping} title={`x ${topping.topping_name}`}/>
                        </View>)
                    }
                </View>
            </View>
        }
    </>

}

export default AddedToppings;

const s = StyleSheet.create({
    toppingHeader: {
        fontFamily: 'GilroyBold',
        fontSize: 17,
        marginTop: 15,
        marginBottom: 7
    },
    singleToppingContainer: {
        marginRight: 10,
    },
    toppings: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    topping: {
        color: Colors.gold,
        fontFamily: 'GilroySemiBold',
        fontSize: 16
    },
})
