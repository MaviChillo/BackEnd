import { Router } from 'express'
// import {ProductManager} from '../src/dao/fileManager/productManager.js'
import {ProductManager} from '../src/dao/mongoManager/productManager.js'
import {CartManager} from '../src/dao/mongoManager/cartManager.js'
import socketServer from "../src/app.js";
import {productsModel} from '../src/dao/models/products.model.js';
import { cartsModel } from '../src/dao/models/carts.model.js';
import {auth, isLogged, isAdmin} from '../middlewares/auth.middleware.js'

const viewsRouter = Router()
// const productManager = new ProductManager('./archivos/products.json') 
const productManager = new ProductManager() 
const cartManager = new CartManager()


//get 

viewsRouter.get('/',async(req,res)=>{
  const products = await productManager.getProducts()
    res.render('home', {products})
})

viewsRouter.get('/realtimeproducts',async (req,res)=>{
  const products = await productManager.getProducts('max')
  socketServer.on('connection', (socket)=>{
    socket.emit('products', products)
  })
    res.render('realTimeProducts', {products})
})

viewsRouter.get('/admin',auth,isAdmin,async(req,res)=>{
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
          res.render('admin', {products, email:req.session.email, first_name:req.session.first_name, last_name:req.session.last_name, role: req.session.role})
    } catch (error) {
        console.log(error)
    }
})

viewsRouter.get('/products',auth, async(req,res)=>{
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

viewsRouter.get('/admin', (req, res)=>{
  res.render('admin')
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