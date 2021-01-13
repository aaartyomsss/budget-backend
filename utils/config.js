require('dotenv/config')

const PORT = process.env.PORT
const DB_CONNECTION = process.env.DB_CONNECTION
const SESSION_SECRET = process.env.SESSION_SECRET
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

module.exports = {
    PORT, 
    DB_CONNECTION, 
    SESSION_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET 
}