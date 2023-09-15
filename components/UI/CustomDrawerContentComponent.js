import { DrawerItems } from 'react-navigation-drawer';
import {ScrollView, SafeAreaView, StyleSheet, Platform, Image, TouchableOpacity} from "react-native";
import React from "react";

import CloseIcon from '../../assets/img/close-icon.png';

export default (props) => (
    <ScrollView>
        <SafeAreaView
            style={s.container}
            forceInset={{ top: 'always', horizontal: 'never' }}
        >
            <TouchableOpacity onPress={() => props.navigation.toggleDrawer()} style={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 30}}>
                <Image source={CloseIcon} style={{width: 30, height: 30, marginLeft: 30, marginTop: Platform.OS === 'ios' ? 15 : 0}} />
            </TouchableOpacity>
            <DrawerItems {...props} />
        </SafeAreaView>
    </ScrollView>
);

const s = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? 60 : 0
    },
});
