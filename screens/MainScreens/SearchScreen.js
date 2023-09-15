import {
    TouchableOpacity,
    View,
    StyleSheet,
    FlatList,
    ImageBackground,
    TextInput,
    ActivityIndicator
} from "react-native";
import React, {useEffect, useState} from "react";
import ScreenHeader from "../../components/UI/ScreenHeader";
import Colors from "../../constants/Colors";
import SinglePizzaMenuCard from "../../components/UI/SinglePizzaMenuCard";
import {Ionicons} from "@expo/vector-icons";
import footerImage from "../../assets/img/auth-header.png";
import Api from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({navigation}) => {

    const [searchValue, setSearchValue] = useState('');
    const [searching, setSearching] = useState(false);
    const [storeId, setStoreId] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('selectedStore').then(res => {
            const store = JSON.parse(res);
            setStoreId(store.id);
        })
    }, [])

    const [searchProducts, setSearchProducts] = React.useState([]);

    const productSearchHandler = async () => {
        const searchString = searchValue;
        if (!searchString) {
            return null;
        }

        try {
            setSearching(true);
            const {data: {data}} = await Api(`products/search?q=${searchString}&store_id=${storeId}`);
            setSearchProducts(data);
            setSearching(false);
        } catch (e) {
            setSearching(false);
            console.log(e);
        }

    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            productSearchHandler();
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
    }, [searchValue])

    return <>
        <ScreenHeader
            title="SEARCH"
            color={Colors.primaryColor}
            navigation={navigation}
        />

        <View style={s.searchView}>
            <View style={s.searchContainer}>
                <TextInput
                    placeholder="TYPE TO SEARCH"
                    onChangeText={text => {
                        setSearchValue(text);
                    }}
                    value={searchValue}
                    keyboardType="default"
                    returnKeyType="done"
                    style={s.searchInput}
                />

                <TouchableOpacity onPress={() => {
                }}>
                    <Ionicons name="md-search" size={26} color="#707070"/>
                </TouchableOpacity>

            </View>

        </View>

        {
            searching && <View style={{height: '90%'}}>
                <ActivityIndicator size="large" color={Colors.gold}/>
            </View>
        }

        {
            !searching && <FlatList
                style={s.flatListContainer}
                contentContainerStyle={s.list}
                columnWrapperStyle={s.column}
                keyExtractor={item => item.id}
                data={searchProducts}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                renderItem={({item, index}) => {
                    return <>
                        {/*{*/}
                        {/*    +item.producttype === DRINK_ID && <SingleDrinkMenuCard activeDrink={0} drink={item} onPressHandler={() => {}} />*/}
                        {/*}*/}
                        <SinglePizzaMenuCard
                            item={item}
                            navigation={navigation}
                            carouselIndex={0}
                        />
                    </>
                }}
            />
        }

        <View style={s.footer}>
            <ImageBackground source={footerImage} style={s.footerImage}/>
        </View>

    </>
}

const s = StyleSheet.create({
    searchView: {
        marginTop: 115,
        marginBottom: 20,
        marginHorizontal: 25,
    },
    searchContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 4
    },
    searchInput: {
        width: '90%',
        borderBottomWidth: 0,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        marginVertical: 0,
        fontFamily: 'GilroyBold',
        color: '#707070'
    },
    flatListContainer: {
        flexDirection: 'column'
    },
    list: {
        marginLeft: 20,
        justifyContent: 'space-around',
        marginBottom: 200
    },
    footer: {
        height: 10,
        backgroundColor: 'red',
    },
    footerImage: {
        width: '100%',
        height: '100%'
    },
})
