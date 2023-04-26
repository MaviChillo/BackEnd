import { Router } from 'express'
import { isNOTAdmin } from '../middlewares/auth.middleware.js'

const chatRouter = Router()

chatRouter.get('/', isNOTAdmin, (req, res)=>{
    res.render('chat')
})

export default chatRouter