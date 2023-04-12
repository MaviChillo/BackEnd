import { Router } from 'express'
import {CartManager} from '../dao/mongoManager/cartManager.js'
import {getAllCarts, addCart, getCartByID, addProdsToCart, updateProductsQuantity,deleteProdsFromCart, emptyCartById} from '../controllers/carts.controller.js';


const cartRouter = Router()
// const cartManager = new CartManager('../src/archivos/carts.json') 
const cartManager = new CartManager() 

// get

cartRouter.get('/', getAllCarts);

cartRouter.get('/:cartId', getCartByID);

//post 

cartRouter.post('/', addCart)


//put

cartRouter.put('/:cartId', addProdsToCart)

cartRouter.put('/:cartId/products/:prodId', updateProductsQuantity)


//delete

cartRouter.delete('/:cartId/product/:prodId', deleteProdsFromCart);

cartRouter.delete('/:cartId', emptyCartById)



export default cartRouter