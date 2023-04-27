import { cartsModel } from '../dao/models/carts.model.js';
import { productsModel } from '../dao/models/products.model.js';
import { ticketModel } from '../dao/models/ticket.model.js';
import {getCarts, addOne, getCartById, addProdToCart, updateProductQuantity, emptyCart, delProdFromCart, deleteCart} from '../services/cart.services.js';
import { cookies } from './users.controller.js';
import jwt from 'jsonwebtoken';

export async function getAllCarts(req,res){
    try {
        const carts = await getCarts()
        res.status(200).json(carts)
    } catch (error) {
        res.status(500).json(error)
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
        res.status(500).json(error)
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
        res.status(500).json(error)
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
            // console.log('stock',productdb.stock)
            // console.log('quantity', quantity)
            // if(quantity > productdb.stock){
            //     res.json({message: 'there is not enough stock'})
            // }
                // const newStock = productdb.stock - quantity
                // await productsModel.findByIdAndUpdate(productdb._id, {stock: newStock})
                const cartMod = await addProdToCart(cartId, products, {new:true})
                res.json({message: 'product added successfully', newCart: cartMod})
            
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export async function updateProductsQuantity(req,res){
    try {
        const {cartId, prodId} = req.params
        const quantity = req.body.quantity
        const updatedCart = await updateProductQuantity(cartId, prodId, quantity)
        res.json({message: "product's quantity updated successfully", updatedCart})
    } catch (error) {
        res.status(500).json(error)
    }
}


export async function purchaseCart(req, res){
    // console.log('user', user)
    try {
        const {cartId} = req.params
        const cart = await getCartById(cartId)
        if(!cart){
            res.json({message: 'Cart not found'})
        }
        const prods = cart.products.map((p)=>p)
        // console.log('prods', prods)
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

            // prods.forEach(p => {
            //     productsModel.findById(p.product, function (err, docs) {
            //     if(err){
            //         console.log(err)
            //         res.json({ message: `Product with Id ${p.product} not found`});
            //         responseSent = true
            //     }else{
            //         if(p.quantity<docs.stock){
            //             res.json({message: `there is not enough stock for ${docs.title}, the stock is: ${docs.stock}. Please lower the stock if you wish to purchase`})
            //             responseSent = true
            //         }else{
            //             console.log('caca')
            //         }   
            //     }
                
            //     })
            // });
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export async function emptyCartById(req,res){
    try {
        const {cartId} = req.params
        const cartEmpty = await emptyCart(cartId)
        res.json({message: 'cart emptied successfully', cartEmpty: cartEmpty})
    } catch (error) {
        res.status(500).json(error)
    }
}

export async function deleteProdsFromCart(req,res){
    try {
        const {cartId, prodId} = req.params
        const cart = await delProdFromCart(cartId, prodId)
        res.json({message:"product deleted successfully",cart});
    } catch (error) {
        res.status(500).json(error)
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
        res.status(500).json(error)
    }
}





