import Modal from "./Modal";
import MyText from "./MyText";
import {View, StyleSheet} from "react-native";
import CheckboxButton from "./CheckboxButton";
import CustomButton from "./CustomButton";
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constants/Colors";

const AddToppingModal = ({
                             showModal = false,
                             onCloseModal,
                             onToggleTopping,
                             maxToppings = null,
                             showPrice = true,
                             currentToppingModal = null,
                                pizzaNo = null
                         }) => {
    const [toppings, setToppings] = useState([]);
    const [selectedToppingsId, setSelectedToppingsId] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('toppings').then(res => {
            const toppings = JSON.parse(res);
            setToppings(toppings)
        })
    }, [])

    const toggleTopping = toppingId => {
        let updatedToppings = [...selectedToppingsId];
        const selectedToppingIndex = selectedToppingsId.findIndex(topping => topping === toppingId);

        if (maxToppings && selectedToppingsId.length >= maxToppings && selectedToppingIndex === -1) {
            return;
        }

        if (selectedToppingIndex !== -1) {
            updatedToppings.splice(selectedToppingIndex, 1);
        } else {
            updatedToppings.push(toppingId)
        }

        setSelectedToppingsId(updatedToppings);
    }

    useEffect(() => {
        const selectedToppings = selectedToppingsId.map(id => ({
            ...toppings.find(topping => topping.id === id),
            parent_topping: pizzaNo
        }))

        if (currentToppingModal) {
            onToggleTopping(selectedToppings, currentToppingModal);
        } else {
            onToggleTopping(selectedToppings);
        }
    }, [selectedToppingsId])


    return <Modal modalVisible={showModal} style={s.toppingModal}>
        <MyText title="Toppings" h2/>
        <MyText title="Choose toppings" p style={{marginTop: 10}}/>

        <View style={s.toppingModalContent}>
            {
                toppings.map(topping => <CheckboxButton labelStyle={{marginLeft: 15}} key={topping.id}
                                                        title={showPrice ? `${topping.topping_name} - ₦${(+topping.price).toLocaleString()}` : topping.topping_name}
                                                        checked={selectedToppingsId.includes(topping.id)}
                                                        onPress={() => {
                                                            toggleTopping(topping.id)
                                                        }}/>)
            }

            <CustomButton
                title="Close"
                style={{...s.goToCart, justifyContent: 'center'}}
                textStyle={s.goToCartText}
                onPress={onCloseModal}
            />
        </View>

    </Modal>
}

export default AddToppingModal;

const s = StyleSheet.create({
    toppingModal: {
        paddingHorizontal: 25
    },
    toppingModalContent: {
        marginTop: 10,
        width: '100%',
    },
    goToCart: {
        backgroundColor: Colors.light,
        marginTop: 15
    },
    goToCartText: {
        color: 'black',
        fontSize: 14
    }
})
