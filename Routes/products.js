const express = require('express');
const { addProduct, getAllProducts } = require('../controller/product.controller');
const router = express.Router();

router.route('/')
    .post(addProduct)
    .get(getAllProducts)
    





module.exports = router