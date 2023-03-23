import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true 
    },
    age:{
        type: Number
    },
    password:{
        type: String,
        required: true
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Carts'
    },
    role:{
        type: String,
        required: true,
        default: 'User'
    }
})

export const usersModel = mongoose.model('Users', usersSchema)