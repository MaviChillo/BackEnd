import { Router } from 'express'
import {CartManager} from '../dao/mongoManager/cartManager.js'
import {getAllCarts, addCart, getCartByID, addProdsToCart, updateProductsQuantity,deleteProdsFromCart, emptyCartById, purchaseCart} from '../controllers/carts.controller.js';
import { isUser } from '../middlewares/auth.middleware.js'



const cartRouter = Router()
// const cartManager = new CartManager('../src/archivos/carts.json') 
const cartManager = new CartManager() 

// get

cartRouter.get('/', getAllCarts);

cartRouter.get('/:cartId', getCartByID);

//post 

cartRouter.post('/', addCart)

cartRouter.post('/:cartId/purchase', purchaseCart)

//put

cartRouter.put('/:cartId', isUser, addProdsToCart)

cartRouter.put('/:cartId/products/:prodId', updateProductsQuantity)


//delete

cartRouter.delete('/:cartId/product/:prodId', deleteProdsFromCart);

cartRouter.delete('/:cartId', emptyCartById)



export default cartRouter