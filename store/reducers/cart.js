import {ADD_TO_CART, DELETE_ITEM_FROM_CART, INIT_CART, SYNC_AND_DELETE_CART, UPDATE_CART} from "../actions/cart";

const initialState = {
    cart: [],
    quantity: 0,
    totalPrice: 0,
    lastCart: [],
    lastQuantity: 0,
    lastTotalPrice: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                cart: state.cart.concat(action.cart),
                quantity: state.cart.length + 1,
                totalPrice: state.totalPrice + action.cart.total_price
            }
        case INIT_CART:
            let totalPrice = action.carts.reduce((x, y) => +x + +y.total_price, 0);

            return {
                ...state,
                cart: action.carts,
                quantity: action.carts.length,
                totalPrice
            }
        case UPDATE_CART:
            let cart = action.cart;
            let cartItemIndex = state.cart.findIndex(c => c.id === cart.id);
            let updatedCart = [...state.cart];
            // let updatedPrice = state.totalPrice - updatedCart[cartItemIndex].total_price + cart.total;
            updatedCart[cartItemIndex] = cart;
            const updatedPrice = updatedCart.map(c => +c.quantity * +c.product_subtotal).reduce((a, b) => a + b)

            return {...state, cart: updatedCart, totalPrice: updatedPrice};
        case DELETE_ITEM_FROM_CART:
            let cartID = action.cartID;
            let cartArray = [...state.cart];
            const cartIndex = cartArray.findIndex(c => c.id === cartID);
            const deletedItem = cartArray.splice(cartIndex, 1);

            return {
                ...state,
                cart: cartArray,
                quantity: state.quantity - 1,
                totalPrice: state.totalPrice - deletedItem[0].total_price
            };
        case SYNC_AND_DELETE_CART:
            const prevState = {...state};
            return {
                lastCart: prevState.cart,
                lastQuantity: prevState.quantity,
                lastTotalPrice: prevState.totalPrice,
                cart: [],
                quantity: 0,
                totalPrice: 0
            };
        default:
            return state;
    }
}
