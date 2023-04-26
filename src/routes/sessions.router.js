import { Router } from "express";
import passport from 'passport';
import '../passport/passportStrategies.js'


const sessionsRouter = Router()


sessionsRouter.get('/current', passport.authenticate('current', {session: false})
,(req, res)=>{
    const reqUser = {...req.user}
    const user = {
        first_name: reqUser[0].first_name,
        last_name: reqUser[0].last_name,
        email: reqUser[0].email,
        age: reqUser[0].age
    }
    res.send({user})
})



export default sessionsRouter