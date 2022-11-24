const express = require('express');
const {verify} = require('../middlewares/authMiddleware')
const { addTocart, getCart, addToWishlist, getWishlist, removeFromWishlist } = require('../controller/product.controller');
const router = express.Router()
const { register, verifyAndRegister, login, resetPassword, forgetPassword, verifyOTP } = require('../controller/userAuth')


// Authentication
router.post('/login', login);
router.post('/register', register);
router.post('/verify', verifyAndRegister);
router.post('/verifyOtp', verifyOTP);

//Forogot password
router.route('/accounts/password')
    .post(forgetPassword)
    .put(resetPassword)

router.route('/cart/')
    .post(verify,addTocart)
    .get(verify,getCart)


router.route('/wishlist')
    .post(verify,addToWishlist)
    .get(verify,getWishlist)
    .delete(verify,removeFromWishlist)

module.exports = router;