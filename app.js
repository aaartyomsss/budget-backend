const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/loggers')
const mongoose = require('mongoose')
const userRouter = require('./routes/users')
const loginRouter = require('./routes/login')

logger.info('Connection to ', config.DB_CONNECTION)

mongoose.connect(config.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        logger.info('Connected to database')
    })
    .catch((e) => {
        logger.error('Error: ', e.message)
    })

// Middleware
app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

// Routes
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)


//Error handling middleware
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app