import { usersModel } from '../dao/models/users.model.js';
import {hashPassword, comparePasswords, generateToken} from '../utils/utils.js';
import {addOneUser} from '../services/users.services.js';
import CustomError from '../utils/errors/CustomError.js';
import {ErrorsCause, ErrorsMessage, ErrorsName} from '../utils/errors/errors.enum.js';
import logger from '../utils/winston.js';


export async function signupUser(req,res){
    try {
        const {email, password} = req.body
        const user = await usersModel.find({email})
        if(user.length!==0){
            logger.error('This user already exists')
            logger.warning('Check your email')
            res.redirect("/errorSignup")
        }
        const hashNewPassword = await hashPassword(password)
        const newUser = {...req.body, password:hashNewPassword}
        //guardado del hash
        await addOneUser(newUser)
        logger.info('Signup successfull')
        res.redirect('/login').json({newUser})
    } catch (error) {
        logger.fatal('Error in signupUser')
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
                        logger.info('Admin logged')
                        res.redirect('/admin')
                    }else{
                        logger.info('User logged')
                        res.redirect('/products')
                    }
                }else{
                    logger.error('Not authorized')
                    res.send('Not authorized')
                }
            }else{
                logger.error('User and/or password does not exist')
                logger.warning('Check again')
                res.redirect('/errorLogin')
            }
        }else{
            logger.error('User and/or password does not exist')
            logger.warning('Check again')
            res.redirect('/errorLogin')
        }
    } catch (error) {
        logger.fatal('Error in loginUser')
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
    logger.info('Logged through GitHub')
    res.redirect("/products");
}

export async function logout(req,res){
    try {
        req.session.destroy((error) => {
            if(error){
                logger.error('Could not logout')
            }else{
                logger.info('Logged out')
                res.clearCookie('token').redirect("/login");
            } 
        });
    } catch (error) {
        logger.fatal('Error in logout')
        CustomError.createCustomError({
            name: ErrorsName.LOGOUT_USER_ERROR, 
            message: ErrorsMessage.LOGOUT_USER_ERROR, 
            cause: ErrorsCause.LOGOUT_USER_ERROR
        })
    }
}