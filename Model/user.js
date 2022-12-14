const { default: mongoose } = require('mongoose')

const schema = require('mongoose').Schema
const { ObjectId } = mongoose.Schema.Types

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
    },
    wishlist : {
            type : ObjectId,
            ref : 'products'
    },
    addresses : [{
        address : {type : String,required : true},
        city : {type : String,required : true},
        pincode : {type : Number,required: true},
        phone : {type : Number, required:true},
        name : {type :String,required:true}
    }]
    
})

module.exports = mongoose.model('User', userModel);