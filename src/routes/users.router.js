import { Router } from "express";
import passport from "passport";
import '../passport/passportStrategies.js'
import { signupUser, loginUser, getGithub, logout } from "../controllers/users.controller.js";
// import { isUser } from "../middlewares/auth.middleware.js";
// import { generateToken } from "../../utils.js";
// import jwt from 'jsonwebtoken';
// import {ProductManager} from '../src/dao/mongoManager/productManager.js'
// import { productsModel } from "../dao/models/products.model.js";


const usersRouter = Router()
// const productManager = new ProductManager() 

usersRouter.post('/signup', signupUser)

usersRouter.post('/login', loginUser)
// admin: 'adminCoder@coder.com','adminCod3r123'

usersRouter.get(
    '/loginGithub',
    passport.authenticate('githubLogin', { scope: ['user:email'] })
);

usersRouter.get(
    "/github",
    passport.authenticate("githubLogin", { failureRedirect: "/errorLogin" }),
    getGithub
);


usersRouter.get('/logout', logout)




//passport

// usersRouter.post('/signup', passport.authenticate('signup',{
//     failureRedirect: '/errorSignup',
//     successRedirect: '/login',
//     passReqToCallback: true,
//     })
// )

//login sin token

// usersRouter.post('/login', passport.authenticate('login',{
//     failureRedirect: '/errorLogin',
//     passReqToCallback: true,
//     })
//     ,(req, res)=>{
//         // console.log('user:', req)
//         req.session.email = req.user.email
//         req.session.first_name = req.user.first_name
//         req.session.last_name = req.user.last_name
//         req.session.age = req.user.age
//         req.session.role = req.user.role
//         console.log(req.session.role)
//         for (const key in req.body) {
//             req.session[key] = req.body[key]
//         }
//         req.session.logged = true
//         // if(req.session.email === 'adminCoder@coder.com' && req.session.password === 'adminCod3r123'){
//         //     req.session.admin = true
//         // }else{
//         //     req.session.admin = false
//         // }
//         if (req.user.role === "Admin") {
//             res.redirect('/admin');
//         } else {
//             res.redirect('/products')
//         }
//     }
// )

//login con token

// usersRouter.post('/login', passport.authenticate('login', {
//     failureRedirect: '/errorLogin',
//     passReqToCallback: true
// })
// ,async(req, res) => {
//     const user = {
//         email: req.user.email,
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         age: req.user.age,
//         role: req.user.role
//     };

//     const token = generateToken(user)
//     console.log('token:', token)
//     res.cookie('token', token)
//     if(token){
//         res.send('authorized')
//     }else{
//         res.send('not authorized')
//     }
//         // if(req.user.role === 'Admin'){
//         //     res.render('admin', {user})
//         // }else{
//         //     // res.redirect('')
//         //     res.render('products', {user})
//         // }
//     // }else{
//     //     res.json({message: 'error'})
//     // }
    
// }
// );


// login con github

// usersRouter.get(
//     '/loginGithub',
//     passport.authenticate('githubLogin', { scope: ['user:email'] })
//   );

// usersRouter.get(
//     '/github',
//     passport.authenticate('githubLogin', { failureRedirect: '/errorLogin' }),
//     async (req, res) => {
//         req.session.email = req.user.email;
//         req.session.first_name = req.user.first_name;
//         req.session.last_name = req.user.last_name;
//         req.session.age = req.user.age;
//         req.session.logged = true
//         if(req.session.email === 'adminCoder@coder.com' && req.session.password === 'adminCod3r123'){
//         req.session.admin = true
//         req.session.user = false
//         req.session.role = 'Admin'
//     }else{
//         req.session.admin = false
//         req.session.user = true
//         req.session.role = 'User'
//     }
//     if (req.session.admin === true) {
//         res.redirect('/admin');
//     } else {
//         res.redirect('/products')
//     }
//     }
// );




// usersRouter.get('/logout', (req, res)=>{
//     req.session.destroy((error)=>{
//         if (error){
//             console.log(error)
//         }else{
//             res.clearCookie('token').redirect('/login')
//         }
//     })
// })

export default usersRouter