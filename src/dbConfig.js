import mongoose from "mongoose";

const URI_MONGO = 'mongodb+srv://MaviChillo:mimamamemima1@cluster0.ijd1vjv.mongodb.net/ecommerce?retryWrites=true&w=majority'

mongoose.set('strictQuery', true);
mongoose.connect(URI_MONGO, (error) =>{
    if(error){
        console.log(error)
    }else{
        console.log('conectado a la db')
    }
})


