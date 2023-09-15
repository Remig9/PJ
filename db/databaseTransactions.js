import * as SQLite from "expo-sqlite";
import {deleteItemFromCart, updateCart} from "../store/actions/cart";
import Api from "../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const db = SQLite.openDatabase("db.pizza_jungle");

export const initTables = (dispatch = null) => {
    // db.transaction(tx => {
    //     tx.executeSql(
    //         'DROP TABLE cart',
    //         null,
    //         (txObj, response) => console.log(response),
    //         (txObj, err) => console.log('Error ', err)
    //     )
    // }, null, (data) => console.log(data));

    db.transaction(
        (tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS cart (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "product_id INTEGER, " +
                "product_name TEXT, " +
                "product_price TEXT, " +
                "quantity INTEGER, " +
                "product_subtotal TEXT, " +
                "total_price TEXT, " +
                "product_image VARCHAR, " +
                "pizza1 VARCHAR NULLABLE, " +
                "pizza2 VARCHAR NULLABLE, " +
                "pizza3 VARCHAR NULLABLE, " +
                "pizza4 VARCHAR NULLABLE, " +
                "pizza5 VARCHAR NULLABLE, " +
                "pizza6 VARCHAR NULLABLE, " +
                "crust_type VARCHAR NULLABLE, " +
                "pizza_size VARCHAR NULLABLE, " +
                "toppings VARCHAR NULLABLE, " +
                "product_type VARCHAR" +
                ")",
                null,
                (txObj, response) => response,
                (txObj, error) => console.log("Error ", error)
            );
        },
        null,
        (data) => {
        }
    );

    db.transaction(
        (tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS addresses (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "address TEXT, " +
                "longitude VARCHAR(20), " +
                "latitude VARCHAR(20), " +
                "default_address TINYINT, " +
                "house_number TEXT, " +
                "delivery_phone TINYINT )",
                null,
                (txObj, response) => response,
                (txObj, error) => console.log("Error add address", error)
            );
        },
        null,
        data => {
        }
    );

    // db.transaction(
    //     (tx) => {
    //         tx.executeSql(
    //             "CREATE TABLE IF NOT EXISTS selected_restaurant (id INTEGER PRIMARY KEY AUTOINCREMENT, restaurant_name STRING, city STRING, restaurant_id INTEGER)",
    //             null,
    //             (txObj, response) => response,
    //             (txObj, error) => console.log("Error ", error)
    //         );
    //     },
    //     null,
    //     (data) => data
    // );
    //
};


/////////////////Cart Transactions/////////////////////////

export const syncCart = (cb = null) => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT * from cart",
            null,
            (txObj, {rows: {_array}}) => {
                // console.log(_array, "allitems");
                cb ? cb(_array) : null;
            },
            (txObj, error) => console.log("Error ", error)
        );
    });
}

export const addToCartDB = (product, productPrice, quantity, productSubtotal, total, pizza1, pizza2, crustType, pizzaSize, toppings, productType, cb, pizza3, pizza4, pizza5, pizza6) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO cart (' +
            'product_id, product_name, product_price, quantity, product_subtotal, total_price, product_image, ' +
            'pizza1, pizza2, crust_type, pizza_size, toppings, product_type, pizza3, pizza4, pizza5, pizza6' +
            ') values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                product.id, product.name, productPrice, quantity, productSubtotal, total, product.productimage, pizza1, pizza2, crustType, pizzaSize, toppings, productType, pizza3, pizza4, pizza5, pizza6],
            (txObj, result) => {
                cb(result);
            },
            (txObj, error) => console.log('Error ', error)
        )
    })
}

export const updateCartDB = (product, cartQuantity, total, pizza1, pizza2, crustType, pizzaSize, toppings, cb, pizza3, pizza4, pizza5, pizza6) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE cart SET ' +
            'quantity = ?, total_price = ?, pizza1 = ?, pizza2 = ?, crust_type = ?, ' +
            'pizza_size = ?, toppings = ?, ' +
            'pizza3 = ?, pizza4 = ?, pizza5 = ?, pizza6 = ? ' +
            'WHERE product_id = ?',
            [cartQuantity, total, pizza1, pizza2, crustType, pizzaSize, JSON.stringify(toppings), pizza3, pizza4, pizza5, pizza6, product.id],
            (txObj, result) => {
                cb(result);
            },
            (txObj, error) => console.log('Error ', error)
        )
    })
}

export const updateCartItemPriceDB = (id, total, quantity, cb) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE cart SET ' +
            'total_price = ?, quantity = ? ' +
            'WHERE id = ?',
            [total, quantity, id],
            (txObj, result) => {
                cb(result);
            },
            (txObj, error) => console.log('Error ', error)
        )
    })
}

export const deleteCartFromDB = (cartId, cb) => {
    db.transaction(tx => {
        tx.executeSql(
            'DELETE FROM cart WHERE id = ?',
            [cartId],
            (txObj, result) => {
                cb(result)
            },
            (txObj, err) => console.log('Error ', err)
        )
    })
}

export const deleteAllCart = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM cart',
                null,
                (txObj, result) => {
                    resolve(result)
                },
                (txObj, err) => {
                    reject(err);
                    console.log('Error while deleting all cart ', err);
                }
            )
        })
    })

}

/////////////////Cart Transactions/////////////////////////


///////////////Addresses Transactions//////////////////////

export const syncAddress = async (cb = null) => {
    let user = await AsyncStorage.getItem('userData');
    if (user) {
        user = JSON.parse(user);
        const {data: {data: addresses}} = await Api.get(`customers/${user.user_data.user.customer_id}/delivery-address`);

        db.transaction((tx) => {
            tx.executeSql(
                "DELETE from addresses where id is not null",
                null,
                async (txObj, {rows: {_array}}) => {
                    await addToAddressDB(addresses);
                    cb ? cb(addresses) : null;
                },
                (txObj, error) => console.log("Error delete addresses", error)
            );
        });
    } else {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * from addresses order by id desc",
                null,
                (txObj, {rows: {_array}}) => {
                    // console.log(_array, "allitems");
                    cb ? cb(_array) : null;
                },
                (txObj, error) => console.log("Error sync addresses", error)
            );
        });
    }
}

export const addToAddressDB = ({id, address, longitude, latitude, default_address, delivery_phone, house_number}) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE addresses SET default_address = 0 where default_address = 1',
                null,
                (txObj, result) => {
                    tx.executeSql(
                        'INSERT INTO addresses (' +
                        'id, address, longitude, latitude, default_address, delivery_phone, house_number' +
                        ') values (?, ?, ?, ?, ?, ?, ?)',
                        [id, address, longitude, latitude, default_address, delivery_phone, house_number],
                        (txObj, result) => {
                            resolve(result)
                        },
                        (txObj, error) => {
                            console.log('Error add address ', error)
                            reject(error);
                        }
                    )
                },
                (txObj, error) => {
                    console.log('Error ', error)
                    reject(error);
                }
            )

        })
    })
}

export const updateAddressDB = ({address, longitude, latitude, default_address, delivery_phone, id}) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE addresses SET ' +
                'address = ?, longitude = ?, latitude = ?, default_address = ?, delivery_phone = ?', +
                    'WHERE id = ?',
                [address, longitude, latitude, default_address, delivery_phone, id],
                (txObj, result) => {
                    console.log('update address db')
                    resolve(result);
                },
                (txObj, error) => {
                    console.log('Error update address ', error)
                    reject(error);
                }
            )
        })
    })
}

///////////////Addresses Transactions//////////////////////
