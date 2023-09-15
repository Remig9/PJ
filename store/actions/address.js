export const ADD_ADDRESS = 'ADD_ADDRESS';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export const INIT_ADDRESSES = 'INIT_ADDRESSES';


export const addAddress = address => ({type: ADD_ADDRESS, address});

export const updateStoreAddress = address => ({type: UPDATE_ADDRESS, address});

export const initAddress = addresses => ({type: INIT_ADDRESSES, addresses});
