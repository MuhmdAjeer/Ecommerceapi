const express = require('express')
const router = express.Router()
const { register, verifyAndRegister, login, resetPassword, forgetPassword, verifyOTP } = require('../controller/userAuth')


// Authentication
router.post('/login', login);
router.post('/register', register);
router.post('/verify', verifyAndRegister);
router.post('/verifyOtp',verifyOTP);

//Forogot password
router.route('/accounts/password')
    .post(forgetPassword)
    .put(resetPassword)

module.exports = router;