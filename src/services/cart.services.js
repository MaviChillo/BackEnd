import { CartManager } from "../dao/mongoManager/cartManager.js";

const cartManager = new CartManager()

export async function getCarts(){
    try {
        const carts = await cartManager.findAll()
        return carts
    } catch (error) {
        return error
    }
}

export async function addOne(obj){
    try {
        const newCart = await cartManager.addCart(obj)
        return newCart
    } catch (error) {
        console.log(error)
    }
}

export async function getCartById(id){
    try {
        const product = await cartManager.findCartById(id)
        return product
    } catch (error) {
        return error
    }
}

export async function addProdToCart(cartId, products){
    try {
        const cart = await cartManager.addProdsToCart(cartId, products)
        return cart
    } catch (error) {
        return error
    }
}

export async function updateProductQuantity(cartId, prodId, quantity){
    try {
        const updateProdQ = await cartManager.updateProductQuantity(cartId, prodId, quantity)
        return updateProdQ
    } catch (error) {
        return error
    }
}

export async function emptyCart(id){
    try {
        const emptyCart = await cartManager.emptyCart(id)
        return emptyCart
    } catch (error) {
        return error
    }
}


export async function delProdFromCart(cartId, prodId){
    try {
        const delProd = await cartManager.delProdFromCart(cartId, prodId)
        return delProd
    } catch (error) {
        return error
    }
}

export async function deleteCart(cartId){
    try {
        const delCart = await cartManager.deleteCart(cartId)
        return delCart
    } catch (error) {
        return error
    }
}