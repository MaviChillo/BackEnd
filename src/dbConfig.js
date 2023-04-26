import mongoose from "mongoose";
import config from "./config.js";


mongoose.set('strictQuery', true);
mongoose.connect(config.mongo_uri, (error) =>{
    if(error){
        console.log(error)
    }else{
        console.log('conectado a la db')
    }
})


