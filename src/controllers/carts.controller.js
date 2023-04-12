import {getCarts, addOne, getCartById, addProdToCart, updateProductQuantity, emptyCart, delProdFromCart, deleteCart} from '../services/cart.services.js';

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
            res.json({cart});
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export async function addProdsToCart(req, res){
    try {
        const {cartId} = req.params
        const products = await req.body
        const cartMod = await addProdToCart(cartId, products)
        res.json({message: 'product added successfully', newCart: cartMod})
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





