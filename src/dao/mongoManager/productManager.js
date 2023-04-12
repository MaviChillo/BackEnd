import {productsModel} from '../models/products.model.js'

export class ProductManager {

    async findProducts(){
        try {
            const products = await productsModel.find()
            return products
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    async addProduct(objProd){
        try {
            const newProduct = await productsModel.create(objProd)
            return newProduct
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    async findProductById(id){
        try {
            const product = await productsModel.findById(id);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async findByIdAndUpdate(id, obj){
        try {
            const updateProduct = await productsModel.findByIdAndUpdate(id, obj);
            return updateProduct;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async deleteProductById(id) {
        try {
            const deleteProd = await productsModel.findByIdAndDelete(id);
            return deleteProd;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

}

