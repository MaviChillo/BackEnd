import {cartsModel} from '../models/carts.model.js'

export class CartManager {

    async findAll(){
        try {
            const carts = await cartsModel.find()
            return carts
        } catch (error) {
            console.log(error)
        }
    }


    async addCart(objCart){
        try {
            const newCart = await cartsModel.create(objCart)
            return newCart
        } catch (error) {
            console.log(error)
        }
    }


    async findCartById(cartId){
        try {
            const cart = await cartsModel.findOne({_id:cartId})
            if(cart){
                return cart;
            } else{
                return 'Cart not found'
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async findCartByIdAndUpdate(cartId, obj){
        try {
            const cart = await cartsModel.findOneAndUpdate({_id:cartId}, obj)
            if(cart){
                return cart;
            } else{
                return 'Cart not found'
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async addProdsToCart(cartId, body) {
        try {
            const cart = await cartsModel.findById(cartId)
            const products = body.products
            cart.products = [...cart.products, ...products]
            await cart.save()
            const updatedCart = await cartsModel.findByIdAndUpdate(cartId, cart)
            return updatedCart
        } catch (error) {
            throw new Error(error);
        }
    }


    async updateProductQuantity(cartId, prodId, quantity) {
        try {
            const cart = await cartsModel.findById({_id:cartId})
            const product = cart.products.find((p) => p.product.toString() === prodId)
            if (!cart) {
                return console.log("Cart not found");
            }
            product.quantity = quantity;
            cart.save();
            return cart
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }


    async emptyCart(id){
        try {
            const cart = await cartsModel.findById(id)
            cart.products = []
            await cart.save()
            return cart
        } catch (error) {
            throw new Error(error);
        }
    }


    async delProdFromCart(cartId, prodId){
        try {
            const cart = await cartsModel.findById(cartId)
            cart.products = cart.products.filter((x) => x.product != prodId)
            await cart.save()
            return cart
        } catch (error) {
            throw new Error(error);
        }
    }


    async deleteCart(cartId) {
        try {
            const cart = await cartsModel.findByIdAndDelete(cartId);
            return cart;
        } catch (error) {
            console.log(error);
        }
    }

}