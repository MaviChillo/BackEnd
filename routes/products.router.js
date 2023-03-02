import { Router } from 'express'
// import {ProductManager} from '../src/dao/fileManager/productManager.js'
import {ProductManager} from '../src/dao/mongoManager/productManager.js'
import { upload } from '../middlewares/multer.js'
import { productsModel } from '../src/dao/models/products.model.js'

const productRouter = Router()
// const productManager = new ProductManager('../src/archivos/products.json') 
const productManager = new ProductManager() 

//get 

productRouter.get('/',async(req,res)=>{
    try {
        const {limit=10, page=1, category} = req.query //default 10 y 1
        const getProds = await productManager.getProducts()
        const productsInfo = await productsModel.paginate({category}, {limit, page})
        if(!limit || !page || !category){
            res.json(getProds)
        }else{
            if(productsInfo.hasPrevPage === false){
            if(productsInfo.hasNextPage === false){
                res.json({
                status:'excitoso', 
                payload:productsInfo.docs, 
                totalPages: productsInfo.totalPages, 
                prevPage: productsInfo.prevPage, 
                nextPage: productsInfo.nextPage, 
                page: productsInfo.page, 
                hasPrevPage: productsInfo.hasPrevPage, 
                hasNextPage: productsInfo.hasNextPage,
                prevLink:null,
                nextLink: null})
            }else{
                res.json({
                status:'excitoso', 
                payload:productsInfo.docs, 
                totalPages: productsInfo.totalPages, 
                prevPage: productsInfo.prevPage, 
                nextPage: productsInfo.nextPage, 
                page: productsInfo.page, 
                hasPrevPage: productsInfo.hasPrevPage, 
                hasNextPage: productsInfo.hasNextPage,
                prevLink:null,
                nextLink: `localhost:8080/api/products/?page=${productsInfo.nextPage}`})
            }
        }else{
            if(productsInfo.hasNextPage === false){
                res.json({
                status:'excitoso', 
                payload:productsInfo.docs, 
                totalPages: productsInfo.totalPages, 
                prevPage: productsInfo.prevPage, 
                nextPage: productsInfo.nextPage, 
                page: productsInfo.page, 
                hasPrevPage: productsInfo.hasPrevPage, 
                hasNextPage: productsInfo.hasNextPage,
                prevLink: `localhost:8080/api/products/?page=${productsInfo.prevPage}`,
                nextLink: null})
            }else{
                res.json({
                status:'excitoso', 
                payload:productsInfo.docs, 
                totalPages: productsInfo.totalPages, 
                prevPage: productsInfo.prevPage, 
                nextPage: productsInfo.nextPage, 
                page: productsInfo.page, 
                hasPrevPage: productsInfo.hasPrevPage, 
                hasNextPage: productsInfo.hasNextPage,
                prevLink: `localhost:8080/api/products/?page=${productsInfo.prevPage}`,
                nextLink: `localhost:8080/api/products/?page=${productsInfo.nextPage}`})
            }
        }
        }
        // /?limit=1&page=1
    } catch (error) {
        res.json({error, status: 'error'})
    }
})

productRouter.get('/:idProduct',async(req,res)=>{
    const {idProduct} = req.params
    console.log(idProduct)
    try {
        const product = await productManager.getProductById(idProduct)
        console.log(product)
        if(product){
            res.json({product})
    }else{
        res.send('Producto no encontrado')
    }
} catch (error) {
    res.send(error)
}
})


//post

productRouter.post('/', upload.single('file'), async(req, res) => {
    const product = req.body
    console.log(product)
    const addNewProduct = await productManager.addProduct(product)
    console.log(addNewProduct)
    res.json({ message: 'Producto agregado con exito', addNewProduct })
})

//put 

productRouter.put('/:idProduct', async(req, res) => {
    const {idProduct} = req.params
    const product = req.body
    try {
        const updateProduct = await productManager.updateProduct(idProduct, ...product)
        console.log(updateProduct)
        res.json({ message: 'Producto modificado con exito'})
    } catch (error) {
        console.log('error')
        return error
    }
})

//delete

productRouter.delete('/:idProduct', async(req, res) => {
    const {idProduct} = req.params
    try {
        const deleteProduct = await productManager.deleteProduct(idProduct)
        console.log(deleteProduct)
        res.json({ message: 'Producto eliminado con exito'})
    } catch (error) {
        console.log('error')
        return error
    }
})




export default productRouter