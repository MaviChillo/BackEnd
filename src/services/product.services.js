import { ProductManager } from "../dao/mongoManager/productManager.js";

const productManager = new ProductManager()

export class ProductServices{

    async getProducts(){
        try {
            const products = await productManager.findProducts()
            return products
        } catch (error) {
            return error
        }
    }


    async addOne(objProd){
        try {
            const newProduct = await productManager.addProduct(objProd)
            return newProduct
        } catch (error) {
            return error
        }
    }


    async getProdById(id){
        try {
            const product = await productManager.findProductById(id)
            return product
        } catch (error) {
            return error
        }
    }


    async getProdByIdAndUpdate(id, obj){
        try {
            const updateProduct = await productManager.findByIdAndUpdate(id, obj)
            return updateProduct
        } catch (error) {
            return error
        }
    }


    async getProdByIdAndDelete(id){
        try {
            const deleteProduct = await productManager.deleteProductById(id)
            return deleteProduct
        } catch (error) {
            return error
        }
    }

}







