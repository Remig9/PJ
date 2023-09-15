import Api from '../helpers/axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const uploadPhoto = file => {
    return new Promise(async (resolve, reject) => {
        let user = await AsyncStorage.getItem('userData');
        user = JSON.parse(user).user_data.user;

        let filename = file.split('/').pop();
        let extension = filename.split('.');
        extension = extension[extension.length - 1];

        let formData = new FormData();

        formData.append("image", {
            uri: file,
            name: `${filename}`,
            type: `image/${extension}`
        });

        formData.append("mobile_path", file.toString())

        try {
            const {data: response} = await Api.post(`customers/${user.customer_id}/update-profile-image`, formData, {
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'multipart/form-data',
                }
            });

            resolve(response);
        } catch (e) {
            console.log(e);
            reject(e);
        }


    })
}
