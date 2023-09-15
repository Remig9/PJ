import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAuthData = (response, updateToken = true) => {
    if (updateToken) {
        AsyncStorage.setItem(
            "userData",
            JSON.stringify({
                user_data: response.data,
            })
        );
        AsyncStorage.setItem(
            "token",
            response.token
        );
    } else {
        AsyncStorage.setItem(
            "userData",
            JSON.stringify({
                user_data: response.data,
            })
        );
    }
}
