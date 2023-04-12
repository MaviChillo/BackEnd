import { Router } from "express";
import passport from 'passport';
import '../passport/passportStrategies.js'


const sessionsRouter = Router()


sessionsRouter.get('/current', passport.authenticate('current', {session: false})
,(req, res)=>{
    const user = {...req.user, password:undefined}
    res.json({user})
})



export default sessionsRouter