const express = require('express');
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const cors = require('cors')


const { errorHandler } = require('./middlewares/errorMiddleware')
const userRouter = require('./Routes/users')
const adminRouter = require('./Routes/admin')

const {connection : connectDB} = require('./config/connection')

const PORT = process.env.PORT || 5000
const app = express()
connectDB()


app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', userRouter);
app.use('/api/v1/admin',adminRouter);


app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started running on port ${PORT}`))

module.exports = app;