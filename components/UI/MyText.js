import React from 'react';
import {Text, StyleSheet} from "react-native";

export default ({
                    h1, h2, h3, h4, h5, h6, p, bold,
                    italic, title, style, ...rest
                }) => {
    return (
        <Text style={
            [
                h1 && {fontSize: 26, fontFamily: 'GilroyBlack'},
                h2 && {fontSize: 20, fontFamily: 'GilroyBlack'},
                h3 && {fontSize: 18, fontFamily: 'GilroyBold'},
                // h4 && {fontSize: 18, fontFamily: 'GilroyBold'},
                h5 && {fontSize: 17, fontFamily: 'GilroyLight'},
                h6 && {fontSize: 16, fontFamily: 'GilroyLight'},
                p && {fontSize: 15, fontFamily: 'GilroyLight'},
                // bold && {fontWeight: 'bold'},
                // italic && {fontSize: 18, fontFamily: 'GilroyBlackItalic'},
                style,
                // styles.text
            ]
        }{...rest}>{title}</Text>
    );
};
