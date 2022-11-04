const { default: mongoose } = require('mongoose')
const {AutoIncrement} = require('../config/connection')

const schema = require('mongoose').Schema

const subCategoryModal = new schema({

    subCategory: {
        type: String,
        required: true
    }
},{timestamps:true})

// subCategoryModal.plugin(AutoIncrement);

module.exports = mongoose.model('SubCategory', subCategoryModal);