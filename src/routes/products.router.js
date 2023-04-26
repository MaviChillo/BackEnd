import { Router } from 'express'
// import { upload } from '../middlewares/multer.js'
import { AddOneProduct, getProductById, updateProdById, deleteProdById, getAllProducts} from '../controllers/products.controller.js'
import { isAdmin } from '../middlewares/auth.middleware.js'

const productRouter = Router()


//get 

productRouter.get('/', getAllProducts)

productRouter.get('/:idProduct', getProductById)

//post

productRouter.post('/', isAdmin, AddOneProduct)

//put 

productRouter.put('/:idProduct', isAdmin, updateProdById)

//delete

productRouter.delete('/:idProduct', isAdmin, deleteProdById)


export default productRouter