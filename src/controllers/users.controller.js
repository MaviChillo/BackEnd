import { usersModel } from '../dao/models/users.model.js';
import {hashPassword, comparePasswords, generateToken} from '../utils/utils.js';
import {addOneUser} from '../services/users.services.js';
import CustomError from './utils/errors/CustomError.js';
import {ErrorsCause, ErrorsMessage, ErrorsName} from './utils/errors/errors.enum.js';


export async function signupUser(req,res){
    try {
        const {email, password} = req.body
        const user = await usersModel.find({email})
        if(user.length!==0){
            res.redirect("/errorSignup")
        }
        const hashNewPassword = await hashPassword(password)
        const newUser = {...req.body, password:hashNewPassword}
        //guardado del hash
        await addOneUser(newUser)
        console.log('user',newUser)
        res.redirect('/login').json({newUser})
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.SIGNUP_USER_ERROR, 
            message: ErrorsMessage.SIGNUP_USER_ERROR, 
            cause: ErrorsCause.SIGNUP_USER_ERROR
        })
    }
}

export const cookies = []

export async function loginUser(req,res){
    try {
        const {email, password} = req.body
        const user = await usersModel.find({email})
        if(user.length !==0){
            const isPass = await comparePasswords(password, user[0].password)
            if(isPass){
                for (const key in req.body) {
                    req.session[key] = req.body[key];
                }
                req.session.logged = true;
                req.session.email = user[0].email;
                req.session.first_name = user[0].first_name;
                req.session.last_name = user[0].last_name;
                req.session.age = user[0].age;
                req.session.role = user[0].role;
                const token = generateToken(user)
                res.cookie('token', token)
                if(token){
                    cookies.push(token)
                    if(user[0].role === "Admin"){
                        res.redirect('/admin')
                    }else{
                        res.redirect('/products')
                    }
                }else{
                    res.send('not authorized')
                }
            }else{
                res.redirect('/errorLogin')
            }
        }else{
            res.redirect('/errorLogin')
        }
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.LOGIN_USER_ERROR, 
            message: ErrorsMessage.LOGIN_USER_ERROR, 
            cause: ErrorsCause.LOGIN_USER_ERROR
        })
    }
}


export async function getGithub(req, res){
    req.session.email = req.user.email;
    req.session.logged = true;
    res.redirect("/products");
}

export async function logout(req,res){
    try {
        req.session.destroy((error) => {
            if (error) console.log(error);
            else res.clearCookie('token').redirect("/login");
        });
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.LOGOUT_USER_ERROR, 
            message: ErrorsMessage.LOGOUT_USER_ERROR, 
            cause: ErrorsCause.LOGOUT_USER_ERROR
        })
    }
}