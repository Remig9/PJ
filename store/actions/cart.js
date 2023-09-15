export const ADD_TO_CART = 'ADD_TO_CART';
export const INIT_CART = 'INIT_CART';
export const UPDATE_CART = 'UPDATE_CART';
export const DELETE_ITEM_FROM_CART = 'DELETE_ITEM_FROM_CART';
export const SYNC_AND_DELETE_CART = 'SYNC_AND_DELETE_CART';

export const addToCart = cart => ({type: ADD_TO_CART, cart});

export const initCart = carts => ({type: INIT_CART, carts});

export const updateCart = cart => ({type: UPDATE_CART, cart});

export const deleteItemFromCart = cartID => ({type: DELETE_ITEM_FROM_CART, cartID});

export const syncAndDeleteCart = () => ({type: SYNC_AND_DELETE_CART});

