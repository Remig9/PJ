import {addToAddressDB, updateAddressDB} from "../db/databaseTransactions";

export const addNewAddress = address => {
    return new Promise(async (resolve, reject) => {

        try {
            await addToAddressDB(address);
            resolve()
        } catch (e) {
            console.log(e, 'error adding address to db');
            reject(e);
        }
    })
}

export const updateAddress = address => {
    return new Promise(async (resolve, reject) => {

        try {
            const updateRes = await updateAddressDB(address);
            console.log({updateRes})
            resolve(true)
        } catch (e) {
            console.log(e, 'error adding address to db');
            reject(e);
        }
    })
}
