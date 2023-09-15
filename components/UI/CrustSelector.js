import {Pressable, View, StyleSheet} from "react-native";
import Colors from "../../constants/Colors";
import MyText from "./MyText";
import React from "react";

export default ({title1 = 'Traditional Crust', title2 = 'Thin Crust', cb = null}) => {

    const [crustIndex, setCrustIndex] = React.useState(0);

    const setCrustHandler = index => {
        setCrustIndex(index);
        cb ? cb(index === 0 ? title1 : title2) : null;
    }

    return <View style={s.crustType}>
        <Pressable
            style={{...s.crust, backgroundColor: crustIndex === 0 ? Colors.lightGreen : 'transparent'}}
            onPress={() => setCrustHandler(0)}>
            <MyText style={{...s.crustText, color: crustIndex === 0 ? 'white' : 'black'}}
                    title={title1} />
        </Pressable>

        <Pressable
            style={{...s.crust, backgroundColor: crustIndex === 1 ? Colors.lightGreen : 'transparent'}}
            onPress={() => setCrustHandler(1)}>
            <MyText style={{...s.crustText, color: crustIndex === 1 ? 'white' : 'black'}} title={title2} />
        </Pressable>
    </View>
}

const s = StyleSheet.create({
    crustType: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        borderRadius: 5,
        overflow: 'hidden'
    },
    crust: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: 'transparent'
    },
    crustText: {
        fontFamily: 'GilroyRegular'
    }
});
