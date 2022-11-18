const { default: mongoose } = require('mongoose')
const { AutoIncrement } = require('../config/connection')

const schema = require('mongoose').Schema
const { ObjectId } = mongoose.Schema.Types


const productModel = new schema({

    name: {
        type: String,
        required: true
    },
    category: {
        id: {
            type: ObjectId,
            required: true,
            ref: 'Category',
            subCategory: {
                type: ObjectId,
                ref: "subCategory"
            }
        }
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: Array,
        required: true
    },
    colors: [
        {
            color: {
                type: String,
                required: true
            },
            images: [
                {
                type: String,
                required: true
            }
        ]
    }
    ],
    inventory: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    offer:{
         type : Number
    },
    ratings: [
        {
            user: {
                type: ObjectId,
                ref: "users"
            },
            rating: {
                type: Number
            }
        }
    ]
}, { timestamps: true })

// categoryModal.plugin(AutoIncrement,{inc_field : "id"});

module.exports = mongoose.model('products', productModel);