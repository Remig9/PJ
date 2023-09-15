import {View, Image, StyleSheet} from "react-native";
import React, {useState} from "react";
import {TouchableOpacity} from "react-native";

import MinusIcon from '../../assets/img/minus.png';
import PlusIcon from '../../assets/img/plus.png';
import Colors from "../../constants/Colors";
import MyText from "./MyText";

const QuantityInput = ({small = false, callback, initQuantity = 1, style}) => {
    const [quantity, setQuantity] = useState(initQuantity);
    const decrement = () => {
        setQuantity(q => {
            if (q === 1) {
                updateQuantity(1);
                return 1;
            } else{
                updateQuantity(quantity - 1);
                return q - 1;
            }
        });

    }

    const increment = () => {
        setQuantity(q => q + 1);
        updateQuantity(quantity + 1)
    }

    const updateQuantity = q => callback(q);

    const quantityBtn = {
        width: small ? 20 : 30,
        height: small ? 20 : 30,
        borderColor: Colors.lightGreen,
        justifyContent: 'center',
        alignItems: 'center'
    }

    const quantityInput = {
        width: small ? 50 : 70,
        borderWidth: 1.5,
        borderColor: Colors.lightGreen,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: small ? 2 : 5,
        marginHorizontal: small ? 10 : 20
    }

    const minusImage = {
        width: small ? 20 : 30,
        height: small ? 20 : 30,
    }

    const plusImage = {
        width: small ? 20 : 30,
        height: small ? 20 : 30,
    }

    return <View style={{...styles.container, ...style}}>
        <TouchableOpacity style={quantityBtn} onPress={decrement}>
            <Image source={MinusIcon} style={minusImage}/>
        </TouchableOpacity>

        <View style={quantityInput}>
            {!small && <MyText title={quantity} style={styles.quantity} h5/>}
            {small && <MyText title={quantity} style={styles.quantity} h6/>}
        </View>

        <TouchableOpacity style={quantityBtn} onPress={increment}>
            <Image source={PlusIcon} style={plusImage}/>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    quantity: {
        color: Colors.lightGreen,
        fontFamily: 'GilroyBold'
    }
})

export default QuantityInput;
