import { usersModel } from '../dao/models/users.model.js';
import jwt from 'jsonwebtoken'
import {hashPassword, comparePasswords, generateToken} from '../utils/utils.js';
import {getUserById, addOneUser, updateUserById} from '../services/users.services.js';
import {addOne} from '../services/cart.services.js'
import CustomError from '../utils/errors/CustomError.js';
import {ErrorsCause, ErrorsMessage, ErrorsName} from '../utils/errors/errors.enum.js';
import logger from '../utils/winston.js';
import config from '../config.js';


export async function signupUser(req,res){
    try {
        const {email, password} = req.body
        // console.log(req.body)
        const user = await usersModel.find({email})
        if(user.length!==0){
            logger.error('This user already exists')
            logger.warning('Check your email')
            res.redirect("/errorSignup")
        }
        const hashNewPassword = await hashPassword(password)
        const newCart = await addOne()
        const newUser = {...req.body, password:hashNewPassword, cart: newCart}
        //guardado del hash
        const add = await addOneUser(newUser)
        if(add){
            logger.info('Signup successfull')
            res.redirect('/login')
        }else{
            logger.error('Could not add user')
            logger.warning('Check your variables')
        }
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
                        //pasar login a last_connection
                        const last = new Date().toLocaleString()
                        const lastConnection = await updateUserById({_id: user[0]._id}, {last_connection: last})
                        console.log('lastConnection',lastConnection)
                        logger.info('Admin logged')
                        res.redirect('/admin')
                    }
                    if(user[0].role === "Premium"){
                        //pasar login a last_connection
                        const last = new Date().toLocaleString()
                        const lastConnection = await updateUserById({_id: user[0]._id}, {last_connection: last})
                        console.log('lastConnection',lastConnection)
                        logger.info('Premium logged')
                        res.redirect('/premium')
                    }
                    if(user[0].role === "User"){
                        //pasar login a last_connection
                        const last = new Date().toLocaleString()
                        const lastConnection = await updateUserById({_id: user[0]._id}, {last_connection: last})
                        console.log('lastConnection',lastConnection)
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

export async function changePassword(req,res){
    const token = await req.cookies.token_CP
    if(!token){
        res.redirect('/errorChangePassword')
    }else{
        const verify = jwt.verify(token, config.jwt_key)
        const email = verify.email
        const find = await usersModel.find({email: email})
        if(!find){
            logger.error('Could not find user with that email adress')
            logger.warning('Check your variables')
            res.json({message: 'User not found'})
        }
        const {newPass, repeatPass} = req.body
        if(!newPass || !repeatPass){
            logger.error('Password not found')
            logger.warning('Check your variables')
            res.json({message: 'Please fill all the boxes'})
        }
        if(newPass !== repeatPass){
            logger.error('Passwords do not match')
            logger.warning('Check your input')
            res.json({message: 'Password do not match'})
        }
        const hash = await hashPassword(newPass)
        const compare = await comparePasswords(find[0].password, hash)
        if(compare === true){
            logger.error('Old Password')
            logger.warning('Please use a password you have not used before')
            res.json({message: 'Old Password'})
        }
        await usersModel.findOneAndUpdate({email:email}, {password:hash}, {new:true})
        res.redirect('/successChangePassword')
    }
}


export async function changeRole(req,res){
    const {uid} = req.params
    const find = await usersModel.findById({_id: uid})
    if(!find){
        logger.error('User not found')
        logger.warning('There is no user with that id')
        res.json({message: 'User not found'})
    }
    if(find.role === 'Admin'){
        logger.error('Cannot change role')
        logger.warning('You cannot change the role of the admin')
        res.json({message: 'Cannot change role'})
    }
    if(find.role === 'Premium'){
        const changeRole = await usersModel.findByIdAndUpdate({_id: uid}, {role: "User"})
        if(!changeRole){
            logger.error('Could not change role')
            logger.warning('Role could not be changed, check the variables')
            res.json({message: 'Could not change role'})
        }
        const newRole = await usersModel.findById({_id: uid})
        logger.info('Roled changed to: User')
        res.json({message: 'Roled changed to: User', newRole})
    }
    if(find.role === 'User'){
        const findDocs = await usersModel.findById({_id: uid})
        // console.log(findDocs.documents)
        const docs = findDocs.documents
        let str
        let array = []
        for(let i = 0; i < docs.length; i++){
            const filename = docs[i].name
            str = filename.split("-");
            str = str[0]
            if(str === 'identification'){
                array.push(str)
            }
            if(str === 'address'){
                array.push(str)
            }
            if(str === 'account'){
                array.push(str)
            }
        }
        if(array.length < 3){
            logger.error('Could not change role to premium')
            logger.warning('You are missing some documents')
            res.json({message: 'Could not change role to premium'})
        }else{
            const changeRole = await usersModel.findByIdAndUpdate({_id: uid}, {role: "Premium"})
            if(!changeRole){
                logger.error('Could not change role')
                logger.warning('Role could not be changed, check the variables')
                res.json({message: 'Could not change role'})
            }
            const newRole = await usersModel.findById({_id: uid})
            logger.info('Roled changed to: Premium')
            res.json({message: 'Roled changed to: Premium', newRole})
        }
    }
}


export async function uploadDocs(req, res){
    const token = cookies[cookies.length - 1]
    let verify
    if(token){
        verify = jwt.verify(token, config.jwt_key)
        // PROFILE
        let profile 
        if(req.files.profile){
            profile = [
                {
                    name: req.files.profile[0].filename,
                    reference: req.files.profile[0].path
                }
            ]
        }
        console.log('profile', profile)
        // PRODUCT
        let product 
        if(req.files.product){
            product = req.files.product
            for(let i = 0; i < product.length; i++){
                product[i].name = product[i]['filename'];
                product[i].reference = product[i]['path'];
                delete product[i].fieldname;
                delete product[i].originalname;
                delete product[i].encoding;
                delete product[i].mimetype;
                delete product[i].destination;
                delete product[i].filename;
                delete product[i].path;
                delete product[i].size;
            }
        }
        console.log('product', product)
        // ARRAYPICS
        let arrayPics
        if(profile){
            if(product){
                arrayPics = [...profile, ...product]
            }else{
                arrayPics = [...profile]
            }
        }
        if(!profile){
            if(product){
                arrayPics = [...product]
            }
        }
        // IDENTIFICATION
        let identification 
        if(req.files.identification){
            identification = [
                {
                    name: req.files.identification[0].filename,
                    reference: req.files.identification[0].path
                }
            ]
        }
        // ADDRESS
        let address 
        if(req.files.address){
            address = [
                {
                    name: req.files.address[0].filename,
                    reference: req.files.address[0].path
                }
            ]
        }
        // ACCOUNT
        let account 
        if(req.files.account){
            account = [
                {
                    name: req.files.account[0].filename,
                    reference: req.files.account[0].path
                }
            ]
        }
        // ARRAYDOCS
        let arrayDocs
        if(identification){
            if(address){
                if(account){
                    arrayDocs = [...identification, ...address, ...account]
                }else{
                    logger.error('Could not submit documents')
                    logger.warning('You are missing the account document, please check.')
                    res.json({message: 'Could not submit documents'})
                }
            }else{
                logger.error('Could not submit documents')
                logger.warning('You are missing the address document, please check.')
                res.json({message: 'Could not submit documents'})
            }
        }else{
            logger.error('Could not submit documents')
            logger.warning('You are missing the identification document, please check.')
            res.json({message: 'Could not submit documents'})
        }

        if(arrayPics){
            const find = await getUserById({_id: verify.user[0]._id})
            find.documents = [...find.documents, ...arrayPics]
            await find.save()
            await updateUserById({_id: verify.user[0]._id}, find)
            console.log('find', find)
            res.redirect('/filesUploaded')
        }
        if(arrayDocs){
            const find = await getUserById({_id: verify.user[0]._id})
            find.documents = [...find.documents, ...arrayDocs]
            await find.save()
            await updateUserById({_id: verify.user[0]._id}, find)
            console.log('find', find)
            res.redirect('/filesUploaded')
        }
        if(!arrayPics && !arrayDocs){
            logger.error('Could not submit documents or upload files')
            logger.warning('You did not attach any documents to submit or files to upload')
            res.json({message: 'Could not submit documents or upload files'})
        }
    }
    if(token === undefined){
        res.json({message: 'You are not logged in, go back to login'})
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
        if(req.session.logged){
            const email = req.session.email
            const user = await usersModel.find({email})
            let uId = user[0]._id
            let _id = JSON.stringify(uId)
            _id = JSON.parse(_id)
            req.session.destroy(async (error) => {
                if(error){
                    logger.error('Could not logout')
                }else{
                    //pasar logout a last_connection
                    console.log('id', _id)
                    const last = new Date().toLocaleString()
                    const lastConnection = await updateUserById(_id, {last_connection: last})
                    console.log('lastConnection',lastConnection)
                    logger.info('Logged out')
                    res.clearCookie('token').redirect("/login");
                } 
            });
        }else{
            res.redirect("/login");
        }
    } catch (error) {
        logger.fatal('Error in logout')
        CustomError.createCustomError({
            name: ErrorsName.LOGOUT_USER_ERROR, 
            message: ErrorsMessage.LOGOUT_USER_ERROR, 
            cause: ErrorsCause.LOGOUT_USER_ERROR
        })
    }
}