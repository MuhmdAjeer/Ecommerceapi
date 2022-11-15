const { default: mongoose } = require('mongoose')
const {AutoIncrement} = require('../config/connection')

const schema = require('mongoose').Schema
const {ObjectId} = mongoose.Schema.Types


const productModel = new schema({

    name : {
        type : String,
        required : true
    },
    category: {
        type: ObjectId,
        required: true,
        ref : 'category',
        subCategory : {
                type : ObjectId,
                ref : "subCategory"
            }
    },
    price : {
        type : Number,
        required : true
    },
    size : {
        type : Array,
        required : true
    },
    colors : {
        type : Array,
        default : []
    },
    images : {
        type:Array,
        default : []
    },
    inventory : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    ratings : [
        {
            user : {
                type : ObjectId,
                ref : "users"
            },
            rating : {
                type : Number
            }
        }
    ]
    },{timestamps:true})

// categoryModal.plugin(AutoIncrement,{inc_field : "id"});

module.exports = mongoose.model('products', productModel);