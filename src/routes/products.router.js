import { Router } from 'express'
// import { upload } from '../middlewares/multer.js'
import { AddOneProduct, getProductById, updateProdById, deleteProdById, getAllProducts} from '../controllers/products.controller.js'
import { isAdmin, isPremium , isAdminOrPremium} from '../middlewares/auth.middleware.js'

const productRouter = Router()


//get 

productRouter.get('/', getAllProducts)

productRouter.get('/:idProduct', getProductById)

//post

productRouter.post('/', isAdminOrPremium, AddOneProduct)

//put 

productRouter.put('/:idProduct', isAdmin, updateProdById)

//delete

productRouter.delete('/:idProduct', isAdminOrPremium, deleteProdById)


export default productRouter