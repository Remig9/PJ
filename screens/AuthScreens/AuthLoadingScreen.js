import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    View,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthLoadingScreen extends React.Component {
    async componentDidMount() {
        await this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        // await AsyncStorage.setItem("@hasSeenTutorial", "false");
        // AsyncStorage.clear();

        let hasSeenTutorial = await AsyncStorage.getItem("@hasSeenTutorial");
        hasSeenTutorial = JSON.parse(hasSeenTutorial);

        // let userData = await AsyncStorage.getItem('userData');
        // userData = JSON.parse(userData);

        let selectedStore = await AsyncStorage.getItem('selectedStore');
        selectedStore = JSON.parse(selectedStore);

        if (!hasSeenTutorial) {
            return this.props.navigation.navigate('Start');
        }

        // if (!userData) {
        //     return this.props.navigation.navigate('Auth');
        // }

        if (!selectedStore) {
            return this.props.navigation.navigate('Location');
        }

        this.props.navigation.navigate('App');
    };

    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

export default AuthLoadingScreen;
