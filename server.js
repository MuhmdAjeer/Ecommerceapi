const express = require('express');
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const cors = require('cors')
const fileUpload = require('express-fileupload')


const { errorHandler } = require('./middlewares/errorMiddleware')
const userRouter = require('./Routes/users')
const adminRouter = require('./Routes/admin')
const productRouter = require('./Routes/products')

const {connection : connectDB} = require('./config/connection');
const { verify } = require('./middlewares/authMiddleware');

const PORT = process.env.PORT || 5000
const app = express()
connectDB()


app.use(morgan('dev'))
app.use(cors())
app.use(fileUpload({useTempFiles: true}))
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', userRouter);
app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/products', verify, productRouter)


app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started running on port ${PORT}`))

module.exports = app;