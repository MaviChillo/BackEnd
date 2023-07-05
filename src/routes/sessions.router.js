import { Router } from "express";
import passport from 'passport';
import '../passport/passportStrategies.js'
import UserDTO from "../dto/user.dto.js";


const sessionsRouter = Router()


sessionsRouter.get('/current', passport.authenticate('current', {session: false})
,(req, res)=>{
    const reqUser = {...req.user}
    const userDto = UserDTO.getUserFrom(reqUser)
    console.log(userDto)
    res.send({userDto})
})



export default sessionsRouter