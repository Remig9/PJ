import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    Modal,
    Pressable,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, ActivityIndicator
} from "react-native";
import PJIcon from '../../assets/icon.png';
import MyText from "./MyText";
import Colors from "../../constants/Colors";
import ControlledInput from "./ControlledInput";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../helpers/axios";
import {parse} from 'fast-xml-parser';

export default () => {
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [user, setUser] = useState(null);
    const [isRating, setIsRating] = useState(false);

    const star = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
    const emptyStar = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';

    const ratingsForm = Yup.object().shape({
        comment: Yup.string(),
    });

    const {control, handleSubmit} = useForm({
        resolver: yupResolver(ratingsForm),
    });

    const onSubmit = async data => {
        setIsRating(true);

        // const xmls = '<?xml version="1.0" encoding="utf-8"?>\n' +
        //     '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n' +
        //     '  <soap12:Body>\n' +
        //     '    <ListOfCountryNamesByName xmlns="http://www.oorsprong.org/websamples.countryinfo">\n' +
        //     '    </ListOfCountryNamesByName>\n' +
        //     '  </soap12:Body>\n' +
        //     '</soap12:Envelope>';
        //
        //
        // const {data: response} = await Api.post('http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso', xmls, {
        //     headers: {
        //         'Content-Type': 'text/xml;charset=utf-8',
        //         'Accept': 'application/json'
        //     }
        // });
        //
        //
        // const obj = parse(response);
        //
        //
        // console.log({obj})
        // return;

        try {
            const {data: response} = await Api.post('/ratings', {
                rating,
                review: data.comment,
                customer_id: user.customer_id
            });


            AsyncStorage.setItem('showRating', '0');
            setShowRatingModal(false);
            setIsRating(false);
        } catch (e) {
            setIsRating(false);
            console.log(e.response.data);
        }
    }

    const closeModal = () => {
        AsyncStorage.setItem('showRating', '0');

        setShowRatingModal(false);
    }

    useEffect(() => {
        // AsyncStorage.setItem('showRating', '1');

        setTimeout(() => {
            AsyncStorage.getItem('userData').then(userData => {
                if (userData) {
                    const user = JSON.parse(userData).user_data.user;
                    setUser(user);
                    AsyncStorage.getItem('showRating').then(val => {
                        setShowRatingModal(val === '1')
                    });
                }
            })

        }, 2000);
    }, []);

    let ratingBar = [];

    for (let i = 1; i <= 5; i++) {
        ratingBar.push(
            <TouchableOpacity
                activeOpacity={0.7}
                key={i}
                onPress={() => setRating(i)}>
                <Image
                    style={s.starImage}
                    source={
                        i <= rating
                            ? {uri: star}
                            : {uri: emptyStar}
                    }
                />
            </TouchableOpacity>
        )
    }

    return <View>
        <Modal
            animationType="slide"
            presentationStyle="overFullScreen"
            transparent={true}
            visible={showRatingModal}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={s.container}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={s.centeredView}>
                        <View style={s.modalView}>
                            <View style={s.modalItemView}>
                                <View style={s.pjIconContainer}>
                                    <Image source={PJIcon} style={s.pjIcon}/>
                                </View>
                                <MyText style={[s.modalText, {fontFamily: 'GilroyBold'}]} h2
                                        title="Rate Our Services and Ease of Use"/>
                                <MyText style={s.modalText} h5
                                        title="If you enjoy using Pizza Jungle App, please take a moment to rate it. Thanks for your support!"/>

                                <View style={s.starsContainer}>{ratingBar}</View>

                                <ControlledInput
                                    style={{marginTop: 15}}
                                    multiline={true}
                                    noOfLines={3}
                                    name="comment"
                                    placeholder="Additional Comments..."
                                    control={control}/>
                            </View>
                            <View style={s.buttonsContainer}>
                                <Pressable
                                    style={[s.button, s.buttonClose]}
                                    onPress={closeModal}>
                                    <MyText style={s.textStyle} h3 title="Dismiss"/>
                                </Pressable>
                                <Pressable
                                    disabled={rating === 0}
                                    style={[s.button, s.buttonRate]}
                                    onPress={handleSubmit(onSubmit)}>
                                    {isRating &&
                                    <ActivityIndicator style={s.indicator} size="small" color={'#ffffff'}/>}
                                    {!isRating && <MyText style={s.textStyle} h3 title="Submit"/>}
                                </Pressable>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    </View>
}

const s = StyleSheet.create({
    container: {
        flex: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        paddingTop: 25,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalItemView: {
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    pjIconContainer: {
        marginBottom: 30
    },
    pjIcon: {
        width: 80,
        height: 80,
    },
    starsContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 15,
    },
    starImage: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 20,
    },
    buttonRate: {
        backgroundColor: Colors.primaryColor,
        borderBottomRightRadius: 20
    },
    buttonClose: {
        backgroundColor: Colors.lightGreen,
        borderBottomLeftRadius: 20
    },
    textStyle: {
        color: 'white',
        textAlign: 'center'
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
