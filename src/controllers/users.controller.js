import { usersModel } from '../dao/models/users.model.js';
import {hashPassword, comparePasswords, generateToken} from '../../utils.js';
import {addOneUser} from '../services/users.services.js';


export async function signupUser(req,res){
    const {email} = req.body
    const user = await usersModel.find({email})
    if(user.length!==0){
        res.redirect("/errorSignup")
    }
    const hashNewPassword = await hashPassword(password)
    const newUser = {...req.body, password:hashNewPassword}
    //guardado del hash
    const newUserBD = await addOneUser(newUser)
    res.redirect('/login')
    return newUserBD
}

export async function loginUser(req,res){
    const {email, password} = req.body
    const user = await usersModel.find({email})
    if(user.length !==0){
        const isPass = await comparePasswords(password, user.password)
        if(isPass){
            const user = {
                email: req.user.email,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                age: req.user.age,
                role: req.user.role
            };
        const token = generateToken(user)
        console.log('token:', token)
        res.cookie('token', token)
        if(token){
            if(req.user.role === 'Admin'){
                res.redirect('/admin', {user})
            }else{
                // res.redirect('')
                res.redirect('/products', {user})
            }
        }else{
            res.send('not authorized')
        }
        }
    }else{
        res.redirect('/errorLogin')
    }
}


export async function getGithub(req, res){
    req.session.email = req.user.email;
    req.session.logged = true;
    res.redirect("/products");
}

export async function logout(req,res){
    req.session.destroy((error) => {
        if (error) console.log(error);
        else res.clearCookie('token').redirect("/login");
    });
}