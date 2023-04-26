import jwt from 'jsonwebtoken'
import { cookies } from '../controllers/users.controller.js'
import '../passport/passportStrategies.js'


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

export function isAdmin(req, res, next) {
    if(req.session.role === "Admin"){
        next()
    } else {
        res.redirect('/products')
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
    // console.log(token)
    if(token){
        const verify = jwt.verify(token, 'secretJWT')
        // console.log(verify)
        // console.log('user',verify.user[0].role)
        if(verify.user[0].role==='User'){
            next()
        }else{
            res.json({message: "You are not authorized"})
        }
    }
}
