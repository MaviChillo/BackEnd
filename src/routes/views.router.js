import { Router } from 'express'
import {ProductManager} from '../dao/mongoManager/productManager.js'
import {CartManager} from '../dao/mongoManager/cartManager.js'
import socketServer from "../app.js";
import {productsModel} from '../dao/models/products.model.js';
import { cartsModel } from '../dao/models/carts.model.js';
import {auth, isLogged,Logged, isAdmin, isNOTAdmin, isPremium} from '../middlewares/auth.middleware.js'
import {getAllProducts} from '../controllers/products.controller.js';

const viewsRouter = Router()
const productManager = new ProductManager() 
const cartManager = new CartManager()


//get 

viewsRouter.get('/',async(req,res)=>{
  const products = await getAllProducts(req,res)
    res.render('home', {products})
})

viewsRouter.get('/realtimeproducts',async (req,res)=>{
  const products = await productManager.findProducts('max')
  socketServer.on('connection', (socket)=>{
    socket.emit('products', products)
  })
    res.render('realTimeProducts', {products})
})

viewsRouter.get('/admin',auth, isAdmin,async(req,res)=>{
    try {
        // /?limit=1&page=1
        const {limit=10, page=1, category} = req.query //default 10 y 1
        let products 
        if(!category){
          products = await productsModel.find().limit(limit).skip(page-1).lean()
        }else{
          products = await productsModel.find({category}).limit(limit).skip(page-1).lean()
        }
        console.log(products)
          res.render('adminOrPremium', {products, email:req.session.email, first_name:req.session.first_name, last_name:req.session.last_name, role: req.session.role})
    } catch (error) {
        console.log(error)
    }
})

viewsRouter.get('/premium',auth, isPremium,async(req,res)=>{
    try {
        // /?limit=1&page=1
        const {limit=10, page=1, category} = req.query //default 10 y 1
        let products 
        if(!category){
          products = await productsModel.find().limit(limit).skip(page-1).lean()
        }else{
          products = await productsModel.find({category}).limit(limit).skip(page-1).lean()
        }
        console.log(products)
          res.render('adminOrPremium', {products, email:req.session.email, first_name:req.session.first_name, last_name:req.session.last_name, role: req.session.role})
    } catch (error) {
        console.log(error)
    }
})

viewsRouter.get('/products',auth, isNOTAdmin, async(req,res)=>{
    try {
        // /?limit=1&page=1
        const {limit=10, page=1, category} = req.query //default 10 y 1
        let products 
        if(!category){
          products = await productsModel.find().limit(limit).skip(page-1).lean()
        }else{
          products = await productsModel.find({category}).limit(limit).skip(page-1).lean()
        }
        console.log(products)
          res.render('products', {products, email:req.session.email, first_name:req.session.first_name, last_name:req.session.last_name, role: req.session.role})
    } catch (error) {
        console.log(error)
    }
})

viewsRouter.get('/carts/:cartId', async(req,res) => {
  const {cartId} = req.params
  const cart = await cartsModel.find({_id:cartId}).lean()
  if(!cart){
      res.json({message: 'Cart not found'})
  }else{
      res.render('cart', {cart});
  }
});


viewsRouter.get('/signup',isLogged, (req, res)=>{
  res.render('signup')
})

viewsRouter.get('/errorSignup', (req, res)=>{
  res.render('errorSignup')
})

viewsRouter.get('/login',isLogged, (req, res)=>{
  res.render('login')
})


viewsRouter.get('/errorLogin', (req, res)=>{
  res.render('errorLogin')
})

viewsRouter.get('/forgotPassword', (req,res)=>{
  res.render('forgotPass')
})

viewsRouter.get('/ChangePassword', (req,res)=>{
  res.render('changePassword')
})

viewsRouter.get('/emailSent', (req,res)=>{
  res.render('emailSent')
})

viewsRouter.get('/errorChangePassword', (req,res)=>{
  res.render('errorChangePassword')
})

viewsRouter.get('/successChangePassword', (req,res)=>{
  res.render('successChangePassword')
})

viewsRouter.get('/uploadDocs',Logged, (req,res)=>{
  res.render('uploadDocs')
})

viewsRouter.get('/filesUploaded', (req,res)=>{
  res.render('filesUploaded')
})

viewsRouter.get('/upgradeToPremium', (req,res)=>{
  res.render('upgradeToPremium')
})


//post

viewsRouter.post('/realtimeproducts', async(req, res)=>{
  try {
    const product = await req.body
    console.log('product:',product)
    await productManager.addProduct(product)
    const products = await productManager.getProducts('max')
    socketServer.sockets.emit('products', products)
  } catch (error) {
    return error
  }
})

export default viewsRouter