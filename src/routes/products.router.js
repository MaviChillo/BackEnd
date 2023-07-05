import { Router } from 'express'
import { AddOneProduct, getProductById, updateProdById, deleteProdById, getAllProducts} from '../controllers/products.controller.js'
import { isAdminOrPremium, isJustAdmin} from '../middlewares/auth.middleware.js'

const productRouter = Router()


//get 

productRouter.get('/', getAllProducts)

productRouter.get('/:idProduct', getProductById)

//post

productRouter.post('/', isAdminOrPremium, AddOneProduct)

//put 

productRouter.put('/:idProduct', isJustAdmin,  updateProdById)

//delete

productRouter.delete('/:idProduct', isAdminOrPremium, deleteProdById)


export default productRouter