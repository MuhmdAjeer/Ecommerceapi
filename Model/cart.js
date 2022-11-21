const { default: mongoose } = require('mongoose')

const schema = require('mongoose').Schema

const {ObjectId} = schema.Types

const cartModel = new schema({
    user  : {
        type : ObjectId,
        ref : 'User',
        require : true
    },
    products : [{
        product : {
            type : ObjectId,
            require : true,
            ref : "products"
        },
        // quantity : {
        //     type : Number,
        //     require : true
        // },
        size : {
            type : String,
            require : true
        },
        color : {
            type : String,
            require : true
        }

    }]
},{timestamps:true})

module.exports = mongoose.model('cart', cartModel);