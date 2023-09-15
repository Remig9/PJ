import {ADD_ADDRESS, INIT_ADDRESSES, UPDATE_ADDRESS} from "../actions/address";

const initialState = {
    addresses: [],
    addressCount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_ADDRESS:
            const addresses = [...state.addresses].map(address => ({...address, default_address: 0}));
            return {...state, addresses: addresses.concat(action.address), addressCount: state.addressCount + 1};
        case UPDATE_ADDRESS:
            const selectedAddress = [...state.addresses].find(address => address.id === action.address.id);
            console.log({selectedAddress});
            return {...state};
            // const new_addresses = [...state.addresses].map(address => ({...address, default_address: 0}));
            // return {...state, addresses: addresses.concat(action.address), addressCount: state.addressCount + 1};
        case INIT_ADDRESSES:
            return {...state, addresses: action.addresses, addressCount: action.addresses.length};
        default:
            return state;
    }
}
