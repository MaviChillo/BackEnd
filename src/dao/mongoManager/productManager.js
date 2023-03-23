import {productsModel} from '../models/products.model.js'

export class ProductManager {

    async getProducts(){
        try {
            const products = await productsModel.find()
            return products
        } catch (error) {
            console.log(error)
        }
    }

    async addProduct(objProd){
        try {
            const newProduct = await productsModel.create(objProd)
            return newProduct
        } catch (error) {
            console.log(error)
        }
    }
}