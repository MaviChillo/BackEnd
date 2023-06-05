import { Router } from 'express'
import {CartManager} from '../dao/mongoManager/cartManager.js'
import {getAllCarts, addCart, getCartByID, addProdsToCart, updateProductsQuantity,deleteProdsFromCart, emptyCartById, purchaseCart, delCart} from '../controllers/carts.controller.js';
import { isUser , isUserOrPremium} from '../middlewares/auth.middleware.js'



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

cartRouter.put('/:cartId', isUserOrPremium, addProdsToCart)

cartRouter.put('/:cartId/product/:prodId', updateProductsQuantity)


//delete

cartRouter.delete('/:cartId/product/:prodId', deleteProdsFromCart);

cartRouter.delete('/:cartId', emptyCartById)

cartRouter.delete('/delete/:cartId', delCart)



export default cartRouter