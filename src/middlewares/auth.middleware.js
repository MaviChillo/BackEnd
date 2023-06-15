import jwt from 'jsonwebtoken'
import { cookies } from '../controllers/users.controller.js'
import '../passport/passportStrategies.js'
import config from '../config.js'

export function auth(req, res, next){
    if(req.session.logged){
        next()
    }else{
        res.redirect('/login')
    }
}

export function isLogged(req, res, next){
    if(req.session.logged){
        if(req.session.admin){
            res.redirect('/admin')
        }else{
            res.redirect('/products')
        }
    }else{
        next()
    }
}

export function Logged(req, res, next){
    if(req.session.logged){
        next()
    }else{
        res.redirect('/login')
    }
}

export async function isJustAdmin(req, res, next) {
    const token = await cookies[cookies.length - 1]
    const verify = jwt.verify(token, config.jwt_key)
    if(verify.user[0].role === "Admin"){
        next()
    }else{
        res.json({message: 'Not authorized'})
    }
}

export function isAdmin(req, res, next) {
    if(req.session.role === "Admin"){
        next()
    } 
    if(req.session.role === "Premium"){
        res.redirect('/premium')
    }
    if(req.session.role === "User"){
        res.redirect('/products')
    }
}

export function isPremium(req,res,next){
    if(req.session.role === "Premium"){
        next()
    }
    if(req.session.role === "Admin"){
        res.redirect('/admin')
    }
    if(req.session.role === "User"){
        res.redirect('/products')
    }
}

export function isAdminOrPremium(req, res, next) {
    if(req.session.role !== "User"){
        next()
    }else{
        res.json({message: 'Not authorized'})
    }
}

export function isUserOrPremium(req, res, next) {
    if(req.session.role !== "Admin"){
        next()
    }else{
        res.json({message: 'Not authorized'})
    }
}



export function isNOTAdmin(req, res, next) {
    if(req.session.role === "User"){
        next()
    } else {
        res.redirect('/admin')
    }
}

export function isUser(req, res, next) {
    const token = cookies[cookies.length - 1]
    if(token){
        const verify = jwt.verify(token, config.jwt_key)
        if(verify.user[0].role==='User'){
            next()
        }else{
            res.json({message: "You are not authorized"})
        }
    }
}

