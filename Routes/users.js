const express = require('express');
const {verify} = require('../middlewares/authMiddleware')
const { addTocart, getCart, addToWishlist, getWishlist, removeFromWishlist } = require('../controller/product.controller');
const router = express.Router()
const { register, verifyAndRegister, login, resetPassword, forgetPassword, verifyOTP } = require('../controller/userAuth');
const { addAddress, getAddresses ,deleteAddress } = require('../controller/user');


// Authentication
router.post('/login', login);
router.post('/register', register);
router.post('/verify', verifyAndRegister);
router.post('/verifyOtp', verifyOTP);

//Forogot password
router.route('/accounts/password')
    .post(forgetPassword)
    .put(resetPassword)

router.route('/profile/address')
    .post(verify,addAddress)
    .get(verify,getAddresses)
    
    // .delete(verify,deleteAddress)
router.delete('/profile/address/:id',verify,deleteAddress)
    
router.route('/cart/')
    .post(verify,addTocart)
    .get(verify,getCart)


router.route('/wishlist')
    .post(verify,addToWishlist)
    .get(verify,getWishlist)

router.delete('/wishlist/:id',verify,removeFromWishlist)

// router.route('/address').post(verify,addAddress)

module.exports = router;