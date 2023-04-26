// dirname
import {dirname} from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


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