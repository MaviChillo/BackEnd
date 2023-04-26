import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code:{
        type: String,
        default: generateCode(),
        unique: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})


function generateCode() {
    let code = ''
    const string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (let i = 0; i < 10; i++) {
        code += string.charAt(Math.floor(Math.random() * string.length))
    }
    return code
}



export const ticketModel = mongoose.model('Ticket', ticketSchema)