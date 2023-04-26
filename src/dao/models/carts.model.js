import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Products'
            },
            quantity: {
                type: Number,
            }
        }
    ]
})

//populate en el find sin ponerlo en el manager
cartsSchema.pre('find', function(next){
    this.populate('products.product')
    next()
})

export const cartsModel = mongoose.model('Carts', cartsSchema)