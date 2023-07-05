import jwt from 'jsonwebtoken'
import {hashPassword, comparePasswords, generateToken} from '../utils/utils.js';
import {getUsers, getAUser, getUserById, addOneUser, updateUserById, delInactiveUsers} from '../services/users.services.js';
import UserDTO from '../dto/user.dto.js';
import {addOne} from '../services/cart.services.js'
import CustomError from '../utils/errors/CustomError.js';
import {ErrorsCause, ErrorsMessage, ErrorsName} from '../utils/errors/errors.enum.js';
import logger from '../utils/winston.js';
import config from '../config.js';
import {transporter} from '../messages/nodemailer.js';


export async function getAllUsers(req,res){
    try {
        const users = await getUsers()
        if(users){
            const usersDto = UserDTO.getUsersFrom(users)
            if(usersDto){
                logger.info('Users found')
                res.json({message: 'Users found', usersDto})
            }else{
                logger.error('Users not found')
                logger.warning('Check variables')
                res.json({message: 'Users not found'})
            }
        }
    } catch (error) {
        logger.fatal('Error in getAllUsers')
        CustomError.createCustomError({
            name: ErrorsName.GET_USERS_ERROR, 
            message: ErrorsMessage.GET_USERS_ERROR, 
            cause: ErrorsCause.GET_USERS_ERROR
        })
    }
}

export async function getUser(email, req, res){
    try {
        const user = await getAUser(email)
        if(user){
            const userDto = UserDTO.getUserFrom(user)
            if(userDto){
                logger.info('User found')
                console.log(userDto)
                return userDto
            }else{
                logger.error('User not found')
                logger.warning('Check variables')
            }
        }
    } catch (error) {
        logger.fatal('Error in getUser')
        CustomError.createCustomError({
            name: ErrorsName.GET_USER_ERROR, 
            message: ErrorsMessage.GET_USER_ERROR, 
            cause: ErrorsCause.GET_USER_ERROR
        })
    }
}

export async function signupUser(req,res){
    try {
        const {email, password} = req.body
        const user = await getAUser(email)
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
        const user = await getAUser(email)
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
                        const lastConnection = await updateUserById({_id: user[0]._id}, {last_connection: last}, {new: true})
                        console.log('lastConnection',lastConnection)
                        logger.info('Admin logged')
                        res.redirect('/admin')
                    }
                    if(user[0].role === "Premium"){
                        //pasar login a last_connection
                        const last = new Date().toLocaleString()
                        const lastConnection = await updateUserById({_id: user[0]._id}, {last_connection: last}, {new: true})
                        console.log('lastConnection',lastConnection)
                        logger.info('Premium logged')
                        res.redirect('/premium')
                    }
                    if(user[0].role === "User"){
                        //pasar login a last_connection
                        const last = new Date().toLocaleString()
                        const lastConnection = await updateUserById({_id: user[0]._id}, {last_connection: last}, {new: true})
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
        const find = await getAUser(email)
        if(!find){
            logger.error('Could not find user with that email adress')
            logger.warning('Check your variables')
            res.json({message: 'User not found'})
        }
        const {newPass, repeatPass} = req.body
        if(!newPass || !repeatPass){
            logger.error('Missing data')
            logger.warning('Check your variables')
            res.json({message: 'Please fill all the boxes'})
        }
        if(newPass !== repeatPass){
            logger.error('Passwords do not match')
            logger.warning('Check your input')
            res.json({message: 'Password do not match'})
        }
        const hash = await hashPassword(newPass)
        const compare = await comparePasswords(newPass, find[0].password)
        if(compare === true){
            logger.error('Old Password')
            logger.warning('Please use a password you have not used before')
            res.json({message: 'Please use a password you have not used before'})
        }
        let json = JSON.stringify(find[0]._id)
        json = await JSON.parse(json)
        const update = await updateUserById({_id: json}, {password:hash}, {new:true})
        if(!update){
            logger.error('Could not update')
            logger.warning('User could not be updated, check variables and try again.')
        }else{
            logger.info('Password changed successfully')
            res.redirect('/successChangePassword')
        }
    }
}


export async function changeRole(req,res){
    const {uid} = req.params
    const find = await getUserById(uid)
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
        const changeRole = await updateUserById({_id: uid}, {role: "User"})
        if(!changeRole){
            logger.error('Could not change role')
            logger.warning('Role could not be changed, check the variables')
            res.json({message: 'Could not change role'})
        }
        const newRole = await getUserById(uid)
        logger.info('Role changed to: User')
        res.json({message: 'Roled changed to: User', newRole})
    }
    if(find.role === 'User'){
        const findDocs = await getUserById(uid)
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
            const changeRole = await updateUserById({_id: uid}, {role: "Premium"})
            if(!changeRole){
                logger.error('Could not change role')
                logger.warning('Role could not be changed, check the variables')
                res.json({message: 'Could not change role'})
            }
            const newRole = await getUserById(uid)
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
            const find = await getUserById(verify.user[0]._id)
            if(find.documents.length !== 0){
                find.documents = [...find.documents, ...arrayPics]
                await find.save()
                await updateUserById({_id: verify.user[0]._id}, find)
                logger.info('Files uploaded successfully', find)
                res.redirect('/filesUploaded')
            }else{
                find.documents = [...arrayPics]
                await find.save()
                await updateUserById({_id: verify.user[0]._id}, find)
                logger.info('Files uploaded successfully', find)
                res.redirect('/filesUploaded')
            }
        }
        if(arrayDocs){
            const find = await getUserById(verify.user[0]._id)
            if(find.documents.length !== 0){
                find.documents = [...find.documents, ...arrayDocs]
                await find.save()
                await updateUserById({_id: verify.user[0]._id}, find)
                logger.info('Files uploaded successfully')
                console.log(find)
                res.redirect('/filesUploaded')
            }else{
                find.documents = [...arrayDocs]
                await find.save()
                await updateUserById({_id: verify.user[0]._id}, find)
                logger.info('Files uploaded successfully')
                console.log(find)
                res.redirect('/filesUploaded')
            }
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
            const user = await getAUser(email)
            let uId = user[0]._id
            let _id = JSON.stringify(uId)
            _id = JSON.parse(_id)
            req.session.destroy(async (error) => {
                if(error){
                    logger.error('Could not logout')
                }else{
                    //pasar logout a last_connection
                    const last = new Date().toLocaleString()
                    const lastConnection = await updateUserById(_id, {last_connection: last})
                    console.log('lastConnection', lastConnection.last_connection)
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

export async function deleteInactiveUsers(req,res){
    try {
        const find = await getUsers()
        find.forEach(user => {
            const dateUser = user.last_connection
            const dateToday = new Date()
            const dateNumberUser = parseInt(dateUser[0]+dateUser[1])
            const result = (dateToday.getDate() - dateNumberUser)
            if(result === 2){
                let _id = JSON.stringify(user._id)
                _id = JSON.parse(_id)
                const del = delInactiveUsers(_id)
                if(del){
                    logger.info('User deleted successfully')
                    const messageOptions = {
                        from:'Chillo E-Commerce',
                        to: user.email,
                        subject: `Deleted Account`,
                        html: `
                        <h2>Hello ${user.first_name} ${user.last_name},</h2>
                        <h3>Your account has been deleted</h3>
                        <p>Your account was deleted due to inactivity for 2 days.</p>
                        `
                        }
                    if(!messageOptions){
                        logger.error('Email not sent')
                        logger.warning('Email not sent, check the variable messageOptions.')
                        res.json({message: 'Email not sent'})
                    }
                    const send = transporter.sendMail(messageOptions)
                    if(!send){
                        logger.error('Email not sent')
                        logger.warning('Email not sent, check the variables')
                        res.json({message: 'Email not sent'})
                    }
                }
            }else{
                logger.info('User active')
            }
        });
        res.json('Inactive user deleted successfully')
    } catch (error) {
        logger.fatal('Error in deleteInactiveUsers')
        CustomError.createCustomError({
            name: ErrorsName.DELETE_INACTIVE_USERS_ERROR, 
            message: ErrorsMessage.DELETE_INACTIVE_USERS_ERROR, 
            cause: ErrorsCause.DELETE_INACTIVE_USERS_ERROR
        })
    }
}