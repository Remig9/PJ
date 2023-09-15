import React from 'react';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import Colors from "../../constants/Colors";


const MapInput = ({notifyChange, defaultValue = "", innerRef}) => {

    const ref = innerRef || React.useRef();

    React.useEffect(() => {
        ref.current?.setAddressText(defaultValue);
    }, []);

    return (
        <GooglePlacesAutocomplete
            ref={ref}
            placeholder='Type your street address'
            minLength={2}
            autoFocus={true}
            returnKeyType={'search'}
            listViewDisplayed={null}
            fetchDetails={true}
            onPress={(data, details = null) => notifyChange(details)}
            query={{
                key: 'AIzaSyBiYGXU2RD65MdiF-VCs284IrxeLUfICVc',
                language: 'en',
                components: 'country:ng'
            }}
            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={200}
            styles={{
                textInputContainer: {},
                textInput: {
                    backgroundColor: '#F4F4F4',
                    fontFamily: 'UbuntuRegular',
                    fontSize: 16,
                    paddingVertical: 5,
                }
            }}
            textInputProps={{ placeholderTextColor: Colors.grey }}
        />
    )
}

export default MapInput;
