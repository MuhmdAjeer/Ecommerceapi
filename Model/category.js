const { default: mongoose } = require('mongoose')
const {AutoIncrement} = require('../config/connection')

const schema = require('mongoose').Schema
const {ObjectId} = mongoose.Schema.Types


const categoryModal = new schema({

    category: {
        type: String,
        required: true
    },
    subCategories : [
        {
            name : {
                type : String
            }
        }
    ],
    icon: {
        type: String,
        required: true
    }
},{timestamps:true})

categoryModal.plugin(AutoIncrement,{inc_field : "id"});

module.exports = mongoose.model('Category', categoryModal);