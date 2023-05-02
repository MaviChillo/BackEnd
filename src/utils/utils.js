// dirname
import {dirname} from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { faker } from "@faker-js/faker"


export const __dirname = dirname(fileURLToPath(import.meta.url)) 

export const hashPassword = async (password)=>{
    return bcrypt.hashSync(password, 10)
}

export const comparePasswords = async (password, hashedPassword)=>{
    return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (user)=>{
    const token = jwt.sign({user}, 'secretJWT')
    return token
}

export const verifyToken = (req,res)=>{
    const token = req?.cookie?.token
    const verify = jwt.verify(token, 'secretJWT')
    return verify
}

// faker.setLocale('es_MX')

export const generateProducts = () => {
    const product = {
        id: faker.database.mongodbObjectId(),
        name : faker.commerce.productName(),
        price : faker.commerce.price(),
        description : faker.commerce.productDescription(),
        category : faker.commerce.department(),
        stock : faker.random.numeric(2),
        image: faker.image.image()
    }
    return product
}