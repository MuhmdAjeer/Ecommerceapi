const { default: mongoose } = require('mongoose')

const schema = require('mongoose').Schema

const adminModel = new schema({

    adminId: {
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
})

module.exports = mongoose.model('Admin', adminModel);