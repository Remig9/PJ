import {StyleSheet, View} from "react-native";
import MyText from "./MyText";
import CustomButton from "./CustomButton";
import Modal from "./Modal";
import React from "react";
import Colors from "../../constants/Colors";

export default ({modalVisible, doneHandler, title, buttonText = "Done", btnIsLoading = false, closeBtnText = null, onCloseHandler = null, children}) => <Modal style={s.modalContainer}
                                                                                             modalVisible={modalVisible}>

    <MyText title={title} style={s.modalHeader} h3/>

    {children}

    <View style={s.doneBtnContainer}>
        <CustomButton title={buttonText} style={s.doneBtn}
                      isLoading={btnIsLoading}
                      textStyle={s.doneBtnText} onPress={doneHandler}/>

        {
            closeBtnText && <CustomButton title={closeBtnText} style={s.closeBtn}
                          isLoading={btnIsLoading}
                          textStyle={s.closeBtnText} onPress={onCloseHandler}/>
        }
    </View>

</Modal>

const s = StyleSheet.create({
    modalContainer: {
        paddingHorizontal: 25,
    },
    modalImage: {
        width: 100,
        height: 100
    },
    modalHeader: {
        fontFamily: 'GilroyBlack',
        fontSize: 21,
        marginBottom: 20
    },
    modalText: {
        marginTop: 20,
        marginBottom: 30,
        fontFamily: 'GilroyBlack',
        fontSize: 19,
        color: Colors.gold
    },
    doneBtnContainer: {
        width: '70%',
        marginTop: 50
    },
    doneBtn: {
        backgroundColor: Colors.lightGreen
    },
    doneBtnText: {
        color: 'white',
        fontFamily: 'GilroyBold',
        fontSize: 18
    },
    closeBtn: {
        backgroundColor: 'transparent',
    },
    closeBtnText: {
        color: Colors.gold,
        fontFamily: 'GilroyBold',
        fontSize: 18
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
