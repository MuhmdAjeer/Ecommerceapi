const express = require('express');
const { addProduct, getAllProducts , getProduct, addTocart,getCart} = require('../controller/product.controller');
const { verify } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
    .post(addProduct)
    .get(getAllProducts)

router.route('/:id')
    .get(getProduct)

    



    





module.exports = router