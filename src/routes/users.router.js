import { Router } from "express";
import passport from "passport";
import '../passport/passportStrategies.js'
import { signupUser, loginUser, getGithub, logout, changePassword, changeRole, uploadDocs, getAllUsers, deleteInactiveUsers} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.js";


const usersRouter = Router()

//POST

usersRouter.post('/signup', signupUser)

usersRouter.post('/login', loginUser)
// users existentes:
// user: 'lucaslause@gmail.com', '12345'
// user: 'misha.collins@gmail.com', '12345'
// premium: 'mavi.chillo@gmail.com', '12345'
// admin: 'adminCoder@coder.com','adminCod3r123'

usersRouter.post('/changePassword', changePassword)

const cpUpload = upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'product', maxCount: 10 }, { name: 'identification', maxCount: 1 }, { name: 'address', maxCount: 1 }, { name: 'account', maxCount: 1 }])
usersRouter.post('/:uid/documents', cpUpload, uploadDocs)

//PUT

usersRouter.put('/premium/:uid', changeRole)

//GET

usersRouter.get('/', getAllUsers)


usersRouter.get(
    '/loginGithub',
    passport.authenticate('githubLogin', { scope: ['user:email'] })
);

usersRouter.get(
    "/github",
    passport.authenticate("githubLogin", { failureRedirect: "/errorLogin" }),
    getGithub
);


usersRouter.get('/logout', logout)

//DELETE

usersRouter.delete('/', deleteInactiveUsers)


export default usersRouter