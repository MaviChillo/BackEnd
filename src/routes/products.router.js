import { Router } from 'express'
import {ProductManager} from '../dao/mongoManager/productManager.js'
// import { upload } from '../middlewares/multer.js'
import { getAllProducts, AddOneProduct, getProductById, updateProdById, deleteProdById} from '../controllers/products.controller.js'

const productRouter = Router()
const productManager = new ProductManager() 

//get 

productRouter.get('/', getAllProducts)

productRouter.get('/:idProduct', getProductById)

//post

productRouter.post('/', AddOneProduct)

//put 

productRouter.put('/:idProduct', updateProdById)

//delete

productRouter.delete('/:idProduct', deleteProdById)


export default productRouter