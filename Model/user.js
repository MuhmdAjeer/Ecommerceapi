const { default: mongoose } = require('mongoose')

const schema = require('mongoose').Schema

const userModel = new schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', userModel);