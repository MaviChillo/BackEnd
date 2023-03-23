import fs from 'fs';


export class CartManager {


    constructor(path){
        this.path = path;
    }


    async getCarts(limit){
        try{
            if(fs.existsSync(this.path)){
                const infoCarts = await fs.promises.readFile(this.path, 'utf-8');
                if(limit === 'max'){
                    return JSON.parse(infoCarts);
                }else{
                    return JSON.parse(infoCarts).slice(0,limit);
                }
            }else{
                return [];
            }
        }catch(error){
            console.log(error);
            return error;
        }
    }



    async addCart(products){
        try{
            const cart ={
                id: await this.#generarId(),
                products:[products]
            }
            const read = await this.getCarts();
            read.push(cart);
            await fs.promises.writeFile(this.path,JSON.stringify(read, null, 2))
        }catch(error){
            console.log(error);
            return error
        }
    }



    async getCartById(idCart){
        try {
            const read = await this.getCarts();
            const cart = read.find((c) => c.id === parseInt(idCart));
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



    async updateCart(idCart, change){
        const read = await this.getCarts();
        let foundCart = await this.getCartById(idCart)
        if(foundCart){
            foundCart = {...foundCart, ...change};
            read = read.map(cart => {
                if(cart.id == foundCart.id){
                    cart = foundCart
                }
                return cart
            })
            read = JSON.stringify(read, null, 2)
            await fs.promises.writeFile(this.path, read)
            console.log(JSON.parse(read))
            return read
        }else{
            console.log('Cart not found');
            return error
        }
    }

    async deleteCart(idCart){
        try {
            let read = await this.getCarts()
            let cart = await this.getCartById(idCart)
            if(cart){
                const filtrado = read.filter(c => c.id != idCart)
                await fs.promises.writeFile(this.path, JSON.stringify(filtrado, null, 2))
                return filtrado
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }



    async addProductToCartById(idCart,idProduct,quantity){
        const read = await this.getCarts();
        const cart = read.find((c) => c.id === parseInt(idCart));
        if (cart === undefined)  return console.log("Not found")
        else {
            const index = read.indexOf(cart);
            if (read[index].products.find((p) => p.id === parseInt(idProduct))){
                const indexProd = read[index].products.indexOf(read[index].products.find((p) => p.id === parseInt(idProduct)));
                read[index].products[indexProd].quantity += quantity;
                await fs.promises.writeFile(this.path,JSON.stringify(read, null, 2));
                return read[index].products[indexProd];
            }else{
                const id = parseInt(idProduct);
                const product = {
                id: id,
                quantity: quantity
                }
                read[index].products.push(product);
                await fs.promises.writeFile(this.path,JSON.stringify(read, null, 2));
                return product;
            }
        }

    }



    async #generarId(){
        const read = await this.getCarts()
        let id =
            read.length === 0
                ? 1
                : read[read.length - 1].id + 1
        return id
    }

}



