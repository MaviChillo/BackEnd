import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usersModel } from "../dao/models/users.model.js";
import {hashPassword, comparePasswords, generateToken} from '../utils/utils.js';
import { Strategy as GitHubStrategy } from "passport-github2";
import {ExtractJwt ,Strategy as jwtStrategy} from "passport-jwt"

//passport local
passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
},async(req, email, password, done)=>{
    const user = await usersModel.find({email})
    if(user.length!==0){
        return done(null, false)
    }
    const hashNewPassword = await hashPassword(password)
    const newUser = {...req.body, password:hashNewPassword}
    //guardado del hash
    const newUserBD = await usersModel.create(newUser)
    done(null, newUserBD)
}))


passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
},async(res, email, password, done)=>{
    const user = await usersModel.findOne({email})
    if(user.length!==0){
        const isPass = await comparePasswords(password, user.password)
        if(isPass){
            return done(null, user)
        }
    }else{
        return done(null, false)
    }
}))




//passport github
passport.use('githubLogin', new GitHubStrategy({
    clientID: 'Iv1.c4ec79fba1d1f84c',
    clientSecret: '444e7f0044c719cb605534c041ca275ed32a7a22',
    callbackURL: "http://localhost:8080/users/github"
  }, async (accessToken, refreshToken, profile, done) => {
    const usuario = await usersModel.findOne({email:profile._json.email})
    return done(null, usuario)
  }
));


//passport jwt con token en cookies

export const cookieExtractor = (req)=>{
    const token = req?.cookies?.token
    return token
}

passport.use('current', new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: 'secretJWT'
}, async (jwtPayload, done)=>{
    console.log('----jwtpayload----', jwtPayload);
    if(jwtPayload.user){
        done(null, jwtPayload.user)
    }else{
        done(null, false)
    }
}))


//1
passport.serializeUser((user, done)=>{
    done(null, user._id)
})
//2
passport.deserializeUser(async(_id, done)=>{
    const user = await usersModel.findById(_id)
    done(null, user)
})





