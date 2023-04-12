import {cartsModel} from '../models/carts.model.js'

export class CartManager {

    async findAll(){
        try {
            const carts = await cartsModel.find()
            return carts
        } catch (error) {
            console.log(error)
        }
    }

    async addCart(objCart){
        try {
            const newCart = await cartsModel.create(objCart)
            return newCart
        } catch (error) {
            console.log(error)
        }
    }

    async findCartById(cartId){
        try {
            const cart = await cartsModel.find({_id:cartId})
            if(cart){
                console.log(cart)
                return cart;
            } else{
                return 'Cart not found'
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }


    async addProdToCart(id, idProduct) {
        try {
            const cart = await cartsModel.findById(id);
            const product = { product : idProduct}
            if(!cart){
                return console.log('cart not found')
            }else{
                cart.products.push(product)
                cart.save()
                return cart
            }
        } catch (error) {
            throw new Error(error);
        }
    }


    async updateProductQuantity(id, prodId, quantity) {
        try {
            const cart = await this.getCartById(id);
            const product = cart.products.find((product) => product._id == prodId);
            if (!cart) {
                return console.log("Cart not found");
            } else {
            product.quantity = quantity;
            cart.save();
            return cart;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }


    async emptyCart(id){
        try {
            const cart = await cartsModel.findById(id)
            cart.products = []
            await cart.save()
            return cart
        } catch (error) {
            throw new Error(error);
        }
    }

    async delProdFromCart(cartId, prodId){
        try {
            const cart = await cartsModel.findById(cartId)
            cart.products = cart.products.filter((x) => x.product != prodId)
            await cart.save()
            return cart
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteCart(id) {
        try {
            const cart = await cartsModel.findByIdAndDelete(id);
            return cart;
        } catch (error) {
            console.log(error);
        }
    } 


    // async addProductToCartById(idCart,idProduct,quantity){
    //     const read = await this.getCarts();
    //     const cart = read.find((c) => c.id === idCart);
    //     if (cart === undefined)  return console.log("Not found")
    //     else {
    //         const index = read.indexOf(cart);
    //         if (read[index].products.find((p) => p.id === parseInt(idProduct))){
    //             const indexProd = read[index].products.indexOf(read[index].products.find((p) => p.id === parseInt(idProduct)));
    //             read[index].products[indexProd].quantity += quantity;
    //             await fs.promises.writeFile(this.path,JSON.stringify(read, null, 2));
    //             return read[index].products[indexProd];
    //         }else{
    //             const id = parseInt(idProduct);
    //             const product = {
    //             id: id,
    //             quantity: quantity
    //             }
    //             read[index].products.push(product);
    //             await fs.promises.writeFile(this.path,JSON.stringify(read, null, 2));
    //             return product;
    //         }
    //     }

    // }
}