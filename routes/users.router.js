import { Router } from "express";
import { usersModel } from '../src/dao/models/users.model.js'

const usersRouter = Router()

// const users = []

//File
// usersRouter.post('/signup', (req, res)=>{
//     const userExist = users.some((u)=>(u.email === req.body.email))
//     if(userExist){
//         res.redirect('/errorSignup')
//     }else{
//         users.push(req.body)
//         res.redirect('/login')
//     }
// })

// usersRouter.post('/login', (req, res)=>{
//     const {email, password} = req.body
//     const user = users.find((u)=>(u.email === email))
//     if(user && user.password === password){
//         for (const key in req.body) {
//             console.log(req.session[key])
//             req.session[key] = req.body[key]
//             // req.body[key] = req.session[key]
//         }
//         res.redirect('/profile')
//     }else{
//         res.redirect('/errorLogin')
//     }
// })

// usersRouter.get('/users/logout', (req, res)=>{
//     req.session.destroy((error)=>{
//         if (error){
//             console.log(error)
//         }else{
//             res.redirect('/login')
//         }
//     })
// })

//mongo

usersRouter.post('/signup', async(req, res)=>{
    const {email, password} = req.body
    const userExist = await usersModel.find({email, password})
    if(userExist.length!==0){
        res.redirect('/errorSignup')
    }else{
        await usersModel.create(req.body)
        res.redirect('/login')
    }
})

usersRouter.post('/login', async(req, res)=>{
    const {email, password} = req.body
    const user = await usersModel.find({email, password})
    if(user.length!==0){
        for (const key in req.body) {
            req.session[key] = req.body[key]
        }
        req.session.logged = true
        if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
            req.session.admin = true
            req.session.user = false
            req.session.role = 'Admin'
        }else{
            req.session.admin = false
            req.session.user = true
            req.session.role = 'User'
        }
        if (req.session.email === user[0].email) {
            req.session.first_name = user[0].first_name;
            req.session.last_name = user[0].last_name;
        }
        if (req.session.admin === true) {
            res.redirect('/admin');
        } else {
            res.redirect('/products')
        }
    }else{
        res.redirect('/errorLogin')
    }
})

usersRouter.get('/logout', (req, res)=>{
    req.session.destroy((error)=>{
        if (error){
            console.log(error)
        }else{
            res.redirect('/login')
        }
    })
})

export default usersRouter