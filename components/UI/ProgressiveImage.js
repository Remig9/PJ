import {Image, View, StyleSheet} from "react-native";
import React from 'react';

const ProgressiveImage = props => {
    return <View style={s.container}>
        <Image {...props} />
    </View>
}

export default ProgressiveImage;

const s = StyleSheet.create({
    imageOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
    container: {
        backgroundColor: '#e1e4e8',
        borderRadius: 180 / 2,
    },
})
