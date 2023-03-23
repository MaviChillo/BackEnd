import { Router } from 'express'

const chatRouter = Router()

chatRouter.get('/', (req, res)=>{
    res.render('chat')
})

export default chatRouter