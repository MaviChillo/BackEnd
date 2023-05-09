import { ProductServices} from "../services/product.services.js";
import {productsModel} from '../dao/models/products.model.js';
import CustomError from '../utils/errors/CustomError.js'
import { ErrorsCause, ErrorsMessage, ErrorsName } from '../utils/errors/errors.enum.js'
import logger from "../utils/winston.js";

const productServices = new ProductServices()

export async function getAllProducts(req,res){
    try {
        const {limit=10, page=1, category} = req.query //default 10 y 1
        const getProds = await productServices.getProducts()
        const productsInfo = await productsModel.paginate({category}, {limit, page})
        if(!limit || !page || !category){
            return getProds
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
    } catch (error) {
        logger.fatal('Error in getAllProducts')
        CustomError.createCustomError({
            name: ErrorsName.GET_PRODUCTS_ERROR, 
            message: ErrorsMessage.GET_PRODUCTS_ERROR, 
            cause: ErrorsCause.GET_PRODUCTS_ERROR
        })
    }
}

export async function getProductById(req, res) {
    try {
        const product = await productServices.getProdById(req.params.idProduct);
    if(product){
        logger.info('Product found')
        res.json({ product });
    }else{
        logger.error('Product not found')
        logger.warning('Check the variables')
        res.send('Product not found')
    }
    } catch (error) {
        logger.fatal('Error in getProductById')
        CustomError.createCustomError({
            name: ErrorsName.GET_PRODUCT_ID_ERROR, 
            message: ErrorsMessage.GET_PRODUCT_ID_ERROR, 
            cause: ErrorsCause.GET_PRODUCT_ID_ERROR
        })
    }
}

export async function AddOneProduct(req,res){
    try {
        const product = req.body
        const addNewProduct = await productServices.addOne(product)
        if(addNewProduct){
            logger.info('Product added successfully')
            res.json({ message: 'Product added successfully', addNewProduct })
        }else{
            logger.error('Product not added')
            logger.warning("Check the product's requirements")
            res.json({ message: 'Product not added'})
        }
    } catch (error) {
        logger.fatal('Error in AddOneProduct')
        CustomError.createCustomError({
            name: ErrorsName.ADD_PRODUCT_ERROR, 
            message: ErrorsMessage.ADD_PRODUCT_ERROR, 
            cause: ErrorsCause.ADD_PRODUCT_ERROR
        })
    }
}

export async function updateProdById(req, res) {
    const id = req.params.idProduct
    const obj = req.body
    try {
        const updateProd = await productServices.getProdByIdAndUpdate(id, obj)
        const updatedProd = await productServices.getProdById(id)
        if(updateProd){
            logger.info('Product updated successfully')
            res.json({ message: 'Product updated successfully', updatedProd })
        }else{
            logger.error('Product not found')
            logger.warning('Check the variables')
            res.json({message:"product not found"})
        }
    } catch (error) {
        logger.fatal('Error in updateProdById')
        CustomError.createCustomError({
            name: ErrorsName.UPDATE_PRODUCT_ERROR, 
            message: ErrorsMessage.UPDATE_PRODUCT_ERROR, 
            cause: ErrorsCause.UPDATE_PRODUCT_ERROR
        })
    }
}

export async function deleteProdById(req, res) {
    const id = req.params.idProduct
    try {
        const deleteProd = await productServices.getProdByIdAndDelete(id)
        if(deleteProd){
            logger.info('Product deleted successfully')
            res.json({ message: 'Product deleted successfully', deleteProd })
        }else{
            logger.error('product not found')
            logger.warning('Check the variables')
            res.json({message:"product not found"})
        }
    } catch (error) {
        logger.fatal('Error in deleteProdById')
        CustomError.createCustomError({
            name: ErrorsName.DELETE_PRODUCT_ERROR, 
            message: ErrorsMessage.DELETE_PRODUCT_ERROR, 
            cause: ErrorsCause.DELETE_PRODUCT_ERROR
        })
    }
}