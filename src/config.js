import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    node_env: process.env.NODE_ENV,
    gmail_user: process.env.GMAIL_USER,
    gmail_password: process.env.GMAIL_PASSWORD,
    jwt_key: process.env.JWT_KEY
}