import swaggerJSDoc from 'swagger-jsdoc'
import {__dirname} from './utils/utils.js'

const swaggerOptions = {
    definition:{
        openapi: '3.0.0',
        info:{
            title: "Chillo's E-commerce API Documentation",
            version: '1.0.0',
            description: "<h1>E-commerce Api</h1> </br> <h3>Welcome to my e-commerce's Api Documentation, here will be presented all of the methods, paths and requirements to work my server.</h3>"
        }
    },
    apis: [`${__dirname}/docs/*.yaml`]
}

export const swaggerSetup = swaggerJSDoc(swaggerOptions)