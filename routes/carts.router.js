import { Router } from 'express'
// import {CartManager} from '../src/dao/fileManager/cartManager.js'
import {CartManager} from '../src/dao/mongoManager/cartManager.js'
import { cartsModel } from '../src/dao/models/carts.model.js'


const cartRouter = Router()
// const cartManager = new CartManager('../src/archivos/carts.json') 
const cartManager = new CartManager() 

// get

cartRouter.get('/', async(req,res) => {
    const carts = await cartManager.getCarts();
    res.json({carts});  
});

cartRouter.get('/:cartId', async(req,res) => {
    const {cartId} = req.params
    const cart = await cartManager.getCartById(cartId);
    if(!cart){
        res.json({message: 'Cart not found'})
    }else{
        res.json({cart});
    }
});

//post 

cartRouter.post('/', async(req, res) => {
    const products = await req.body;
    const quantity = await req.body
    const newCart = await cartManager.addCart(products, quantity);
    if(!newCart){
        res.json({message:"error"});
    }else{
        res.json({message:"Carrito creado con éxito",newCart});
    }
})


//put

cartRouter.put('/:cartId', async(req, res)=>{
    const {cartId} = req.params
    const products = await req.body
    const cartMod = await cartManager.addProdToCart(cartId, products)
    res.json({message: 'product added successfully', newCart: cartMod})
})

cartRouter.put('/:cartId/products/:prodId', async(req, res)=>{
    const {cartId} = req.params
    const {prodId} = req.params
    const quantity = await req.body
    const quantityMod = await cartsModel.findOneAndReplace(prodId, quantity, {new: true})
    res.json({message: "product's quantity modified successfully", quantityMod})
})


//delete

cartRouter.delete('/:cartId/product/:prodId',async(req,res) => {
    const {cartId, prodId} = req.params
    const cart = await cartManager.delProdFromCart(cartId, prodId)
    // cart.products = await cartsModel.findByIdAndDelete(prodId)
    // await cart.save()
    res.json({message:"product deleted successfully",cart});
});


cartRouter.delete('/:cartId', async(req, res)=>{
const {cartId} = req.params
const cartEmpty = await cartManager.emptyCart(cartId)
// const {prodId} = req.body
// const cartDelete = await cartsModel.findByIdAndDelete(prodId)
res.json({message: 'cart emptied successfully', cartEmpty: cartEmpty})
})



export default cartRouter