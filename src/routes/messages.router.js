import { Router } from "express";
import { ForgotPass } from "../controllers/messages.controller.js";

const messagesRouter = Router()


messagesRouter.post('/', ForgotPass)


export default messagesRouter