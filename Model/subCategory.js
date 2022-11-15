const { default: mongoose } = require('mongoose')
const {AutoIncrement} = require('../config/connection')

const schema = require('mongoose').Schema
const {ObjectId} = mongoose.Schema.Types

const subCategoryModal = new schema({
    name: {
        type: String,
        required: true
    },
    category : {
        type : ObjectId,
        ref : 'category'
    }
},{timestamps:true})

// subCategoryModal.plugin(AutoIncrement);

module.exports = mongoose.model('SubCategory', subCategoryModal);