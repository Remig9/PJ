import {deleteAllCart} from "../db/databaseTransactions";
import {syncAndDeleteCart} from "../store/actions/cart";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const logout = (dispatch) => {
    return new Promise(async (resolve, reject) => {
        await deleteAllCart();
        dispatch(syncAndDeleteCart());

        await AsyncStorage.removeItem("authentication_data");
        // await AsyncStorage.removeItem("selectedStore");
        resolve();
    });
}

export const redirectIntended = async (redirectTo, navigation) => {
    if (redirectTo === 'checkout') {
        const selectedRestaurantString = await AsyncStorage.getItem('selectedStore');

        const deliveryType = await AsyncStorage.getItem('deliveryType');

        navigation.navigate("App");
        AsyncStorage.removeItem('redirectTo');

        return navigation.navigate("Checkout", {deliveryType, selectedStore: JSON.parse(selectedRestaurantString)});
    } else if (redirectTo === 'profile') {
        navigation.navigate('App');
        AsyncStorage.removeItem('redirectTo');

        return navigation.navigate("Account");
    } else if (redirectTo === 'orders') {
        navigation.navigate('App');
        AsyncStorage.removeItem('redirectTo');

        return navigation.navigate("Orders");
    }
}
