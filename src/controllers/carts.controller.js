import { cartsModel } from '../dao/models/carts.model.js';
import { productsModel } from '../dao/models/products.model.js';
import { ticketModel } from '../dao/models/ticket.model.js';
import {getCarts, addOne, getCartById, addProdToCart, updateProductQuantity, emptyCart, delProdFromCart, deleteCart} from '../services/cart.services.js';
import { cookies } from './users.controller.js';
import jwt from 'jsonwebtoken';
import CustomError from './utils/errors/CustomError.js'
import { ErrorsCause, ErrorsMessage, ErrorsName } from './utils/errors/errors.enum.js'

export async function getAllCarts(req,res){
    try {
        const carts = await getCarts()
        res.status(200).json(carts)
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.GET_CARTS_ERROR, 
            message: ErrorsMessage.GET_CARTS_ERROR, 
            cause: ErrorsCause.GET_CARTS_ERROR
        })
    }
}

export async function addCart(req,res){
    try {
        const products = await req.body;
        const quantity = await req.body
        const newCart = await addOne(products,quantity)
        if(!newCart){
            res.json({message:"error"});
        }else{
            res.json({message:"Cart created successfully", newCart});
        }
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.ADD_CART_ERROR, 
            message: ErrorsMessage.ADD_CART_ERROR, 
            cause: ErrorsCause.ADD_CART_ERROR
        })
    }
}

export async function getCartByID(req,res){
    try {
        const {cartId} = req.params
        const cart = await getCartById(cartId)
        if(!cart){
            res.json({message: 'Cart not found'})
        }else{
            res.json({cart})
        }
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.GET_CART_ID_ERROR, 
            message: ErrorsMessage.GET_CART_ID_ERROR, 
            cause: ErrorsCause.GET_CART_ID_ERROR
        })
    }
}

export async function addProdsToCart(req, res){
    try {
        const {cartId} = req.params
        const products = await req.body
        const cartdb = await getCartById(cartId)
        if(!cartdb){
            return res.json({message: 'Cart not found'})
        }
        // const prodsInCart = cartdb.products.map((p)=>p.product)
        const newProd = products.products[0].product
        const quantity = products.products[0].quantity
        const productdb = await productsModel.findById(newProd)
        if(!productdb){
            res.json({message: 'prod not found'})
        }
        if(cartdb.products.find(
            (p) => p.product.toString() === newProd
        )){
            return res.json({message: 'product already in the cart'})
        }else{
                const cartMod = await addProdToCart(cartId, products, {new:true})
                res.json({message: 'product added successfully', newCart: cartMod})
            
        }
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.ADD_PROD_TO_CART_ERROR, 
            message: ErrorsMessage.ADD_PROD_TO_CART_ERROR, 
            cause: ErrorsCause.ADD_PROD_TO_CART_ERROR
        })
    }
}

export async function updateProductsQuantity(req,res){
    try {
        const {cartId, prodId} = req.params
        const quantity = req.body.quantity
        const updatedCart = await updateProductQuantity(cartId, prodId, quantity)
        res.json({message: "product's quantity updated successfully", updatedCart})
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.UPDATE_PRODS_QUANTITY_ERROR, 
            message: ErrorsMessage.UPDATE_PRODS_QUANTITY_ERROR, 
            cause: ErrorsCause.UPDATE_PRODS_QUANTITY_ERROR
        })
    }
}


export async function purchaseCart(req, res){
    try {
        const {cartId} = req.params
        const cart = await getCartById(cartId)
        if(!cart){
            res.json({message: 'Cart not found'})
        }
        const prods = cart.products.map((p)=>p)
        let responseSent = false
        if(prods.length === 0){
            res.json({message: 'The cart is empty'})
        }else{
            const total = []
            const stock = []
            const noStock = []            
            for (const p of prods){
                const product = await productsModel.findById(p.product)
                if (!product) {
                    res.json({ message: `Product with id ${p.product} not found`})
                    responseSent = true
                    break
                }
                if(product.stock !==0 && p.quantity > product.stock){
                    await res.json({message: `There is not enough stock for ${product.title}, the stock is: ${product.stock}. Please lower the stock if you wish to purchase`})
                    responseSent = true
                    break
                }
                if(product.stock !== 0){
                    const newStock = product.stock - p.quantity
                    await productsModel.findByIdAndUpdate(product._id, {stock: newStock},{new:true})
                    stock.push(p)
                    const price = product.price
                    total.push(price)
                }
                if(product.stock === 0){
                    noStock.push(p)
                }
            }
            if(!responseSent){
                let sum = 0
                for (let key in total) {
                    sum += total[key]
                }
                console.log('sum',sum)
                const token = cookies[cookies.length - 1]
                let verify
                if(token){
                    verify = jwt.verify(token, 'secretJWT')
                }
                let email
                if(verify){
                    email = verify.user[0].email
                }
                const ticket = await ticketModel.create({amount: sum, purchaser: email})
                console.log('ticket', ticket)
                if(!ticket){
                    res.json({ message: "Could not create ticket" })
                }
                await emptyCart(cartId)
                await getCartById(cartId)
                console.log('no stock', noStock)
                const noStockInCart = await cartsModel.findByIdAndUpdate(cartId, {products:noStock}, {new: true})
                console.log('in cart', noStockInCart)
                res.json({ message: "Purchase successful. Here's your Ticket:", ticket})
            }
        }
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.PURCHASE_CART_ERROR, 
            message: ErrorsMessage.PURCHASE_CART_ERROR, 
            cause: ErrorsCause.PURCHASE_CART_ERROR
        })
    }
}

export async function emptyCartById(req,res){
    try {
        const {cartId} = req.params
        const cartEmpty = await emptyCart(cartId)
        res.json({message: 'cart emptied successfully', cartEmpty: cartEmpty})
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.EMPTY_CART_ERROR, 
            message: ErrorsMessage.EMPTY_CART_ERROR, 
            cause: ErrorsCause.EMPTY_CART_ERROR
        })
    }
}

export async function deleteProdsFromCart(req,res){
    try {
        const {cartId, prodId} = req.params
        const cart = await delProdFromCart(cartId, prodId)
        res.json({message:"product deleted successfully",cart});
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.DEL_PROD_FROM_CART_ERROR, 
            message: ErrorsMessage.DEL_PROD_FROM_CART_ERROR, 
            cause: ErrorsCause.DEL_PROD_FROM_CART_ERROR
        })
    }
}

export async function delCart(req,res){
    try {
        const {cartId} = req.params
        const deletedCart = await deleteCart(cartId)
        if(deletedCart){
            res.json({message:"cart deleted successfully",cart});
        }else{
            res.json({message: 'Cart not found'})
        }
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.DELETE_CART_ERROR, 
            message: ErrorsMessage.DELETE_CART_ERROR, 
            cause: ErrorsCause.DELETE_CART_ERROR
        })
    }
}





