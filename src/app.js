import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import chatRouter from './routes/chat.router.js'
import sessionsRouter from './routes/sessions.router.js'
import usersRouter from './routes/users.router.js'
import mockingRouter from './routes/mocking.router.js'
import loggerRouter from './routes/logger.router.js'
import { __dirname } from './utils/utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import './dbConfig.js'
import { messagesModel } from "./dao/models/messages.model.js";
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import config from './config.js'
import { errorMiddleware } from './utils/errors/errors.middleware.js'
import {generateLog} from './middlewares/winston.middleware.js';


const app = express()

//file session
import FileStore from 'session-file-store'
const fileStore = FileStore(session)

//mongo session
import mongoStore from 'connect-mongo'

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))
app.use(cookieParser())

//handlebars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/src/views')


//session mongo
app.use(session({
  store: new mongoStore({
    mongoUrl: 'mongodb+srv://MaviChillo:mimamamemima1@cluster0.ijd1vjv.mongodb.net/ecommerce?retryWrites=true&w=majority'
  }),
  resave: true,
  saveUninitialized:true,
  secret: 'secretKey',
  cookie: {maxAge: 60000}
}))

//trabajar con passport
  //inicializar
  app.use(passport.initialize())
  //passport va a guardar la info de session
  app.use(passport.session())

// ROUTES
app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/users', usersRouter)
app.use('/chat', chatRouter)
app.use('/mockingproducts', mockingRouter)
app.use('/loggerTest', loggerRouter)


app.use(generateLog)

app.use(errorMiddleware)

const httpServer = app.listen(config.port, () => {
  console.log(`Escuchando al puerto ${config.port}`)
})


const socketServer = new Server(httpServer) 
const mensajes = []

socketServer.on('connection', (socket)=>{
    console.log(`Usuario conectado: ${socket.id}`)

    socket.on('disconnect', ()=>{
        console.log(`Usuario desconectado`)
    })

    //chat

    socket.on('mensaje', info=>{
      mensajes.push(info)
      socketServer.emit('chat', mensajes)
      // console.log('mensajes', mensajes)
      async function addMessage(){
        try {
          const newMessage = await messagesModel.create(info)
          return newMessage
        } catch (error) {
          console.log(error)
        }
      }
      addMessage()
        console.log(info)
    })


})

export default socketServer;






