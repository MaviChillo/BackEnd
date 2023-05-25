// dirname
import {dirname, join} from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { faker } from "@faker-js/faker"
import config from '../config.js'


const __filename = fileURLToPath(import.meta.url);
export const __dirname = join(dirname(__filename), '..')


export const hashPassword = async (password)=>{
    return bcrypt.hashSync(password, 10)
}

export const comparePasswords = async (password, hashedPassword)=>{
    return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (user)=>{
    const token = jwt.sign({user}, config.jwt_key)
    return token
}

export const verifyToken = (req,res)=>{
    const token = req?.cookie?.token
    const verify = jwt.verify(token, config.jwt_key)
    return verify
}


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

export const generateCode = () =>{
    let code = ''
    const string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (let i = 0; i < 5; i++) {
        code += string.charAt(Math.floor(Math.random() * string.length))
    }
    return code
}