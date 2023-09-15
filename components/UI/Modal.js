import {Modal, View, StyleSheet} from "react-native";
import React from "react";

export default ({modalVisible = false, style = {paddingHorizontal: 30}, children}) => {
    return <Modal
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
    >
        <View style={s.modalViewWrapper}>
            <View style={[s.modalView, style]}>
                {children}
            </View>
        </View>
    </Modal>
}

const s = StyleSheet.create({
    modalViewWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 30
    },
    modalView: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 30,
        paddingHorizontal: 50,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})
