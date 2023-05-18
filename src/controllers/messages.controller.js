import {transporter} from '../messages/nodemailer.js';
import {usersModel} from '../dao/models/users.model.js';
import {cookies} from './users.controller.js';
import jwt from 'jsonwebtoken'
import config from '../config.js';
import logger from '../utils/winston.js';
import CustomError from '../utils/errors/CustomError.js';
import {ErrorsCause, ErrorsMessage, ErrorsName} from '../utils/errors/errors.enum.js';


export async function ForgotPass(req,res){
    const {email} = req.body
    const find = await usersModel.find({email})
    if(!find){
        logger.error('User not found')
        logger.warning('This email does not belong to a registered user')
        res.json({message: 'User not found'})
    }
    const token = jwt.sign({ email }, config.jwt_key, { expiresIn: '1h' })
    if(!token){
        logger.error('Token not signed')
        logger.warning('Token could not be signed, check the variables')
        res.json({message: 'Token not signed'})
    }
    res.cookie('token_CP', token)
    const messageOptions = {
        from:'MaviChillo',
        to: email,
        subject: `Hello ${find[0].first_name} ${find[0].last_name}!`,
        html: `
        <h3>Click on this link to reset your password</h3>
        <form action="http://localhost:8080/changePassword" method="get">
            <input type="submit" value="Click me!"/>
        </form>
        `
    }
    if(!messageOptions){
        logger.error('Email not sent')
        logger.warning('Email not sent, check the variables')
        res.json({message: 'Email not sent'})
    }
    try {
        await transporter.sendMail(messageOptions)
        res.redirect('/emailSent')
    } catch (error) {
        logger.fatal('Error in ForgotPass')
        CustomError.createCustomError({
            name: ErrorsName.FORGOT_PASS_ERROR, 
            message: ErrorsMessage.FORGOT_PASS_ERROR, 
            cause: ErrorsCause.FORGOT_PASS_ERROR
        })
    }
}