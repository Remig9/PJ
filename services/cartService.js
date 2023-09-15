import {
  addToCartDB,
  deleteCartFromDB,
  updateCartDB,
  updateCartItemPriceDB,
} from "../db/databaseTransactions";
import {
  addToCart,
  deleteItemFromCart,
  updateCart,
} from "../store/actions/cart";

export const addItemToCart = (
  dispatch,
  cart,
  product,
  quantity = 1,
  productSubtotal,
  total,
  productPrice,
  pizza1 = null,
  pizza2 = null,
  crustType = null,
  productSize = null,
  toppings = [],
  productType = "pizza", // pizza, deal, drink
  cb,
  pizza3 = null,
  pizza4 = null,
  pizza5 = null,
  pizza6 = null
) => {
  toppings =
    toppings.length > 0 ? JSON.stringify(toppings) : JSON.stringify([]);

  const addToCartStore = (result) => {
    dispatch(
      addToCart({
        id: result.insertId,
        product_price: +productPrice,
        product_subtotal: productSubtotal,
        total_price: total,
        product_name: product.name,
        product_id: product.id,
        quantity,
        product_image: product.productimage,
        pizza1,
        pizza2,
        crust_type: crustType,
        pizza_size: productSize,
        toppings: toppings,
        product_type: productType,
        pizza3,
        pizza4,
        pizza5,
        pizza6,
      })
    );
    cb();
  };

  addToCartDB(
    product,
    productPrice,
    quantity,
    productSubtotal,
    total,
    pizza1,
    pizza2,
    crustType,
    productSize,
    toppings,
    productType,
    addToCartStore,
    pizza3,
    pizza4,
    pizza5,
    pizza6
  );
  // } else {
  //     const newPrice = quantity * +productPrice;
  //     const total = +newPrice + +productInCart.total_price;
  //     const cartQuantity = quantity + productInCart.quantity;
  //
  //     const updateCartStore = result => {
  //         dispatch(updateCart({...productInCart, total_price: total, quantity: cartQuantity}));
  //         cb();
  //     }
  //
  //     updateCartDB(product, cartQuantity, total, pizza1, pizza2, crustType, productSize, toppings, updateCartStore);
  // }
};

export const deleteCartItem = (cartId, dispatch, cb) => {
  const afterDelete = () => {
    dispatch(deleteItemFromCart(cartId));
    cb();
  };
  deleteCartFromDB(cartId, afterDelete);
};

export const updateCartItemPrice = (dispatch, cartItem, cb) => {
  const updateCartStore = (result) => {
    dispatch(updateCart(cartItem));
    cb();
  };

  updateCartItemPriceDB(
    cartItem.id,
    cartItem.total,
    cartItem.quantity,
    updateCartStore
  );
};
