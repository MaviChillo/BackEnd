import { Router } from "express";
import logger from '../utils/winston.js'

const loggerRouter = Router()

loggerRouter.get('/', (req,res)=>{
    logger.fatal('log fatal')
    logger.error('log error')
    logger.warning('log warning')
    logger.info('log info')
    logger.http('log http')
    logger.debug('log debug')
    res.send('testing logs')
})

export default loggerRouter