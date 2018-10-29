const DB_HOST = 'localhost'
const DB_PORT = '27017'
const DB_USER = ''
const DB_PWD = ''
const DB_NAME = 'stack'
const DB_CONNECTION_STRING = `mongodb://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

const JWT_KEY = 'jwt_key'

let config = {}
config.dbURL = DB_CONNECTION_STRING
config.jwtKey = JWT_KEY

module.exports = config
