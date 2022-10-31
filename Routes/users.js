const express = require('express')
const router = express.Router()
const { register, verifyAndRegister, login, resetPassword, forgetPassword } = require('../controller/userAuth')


// Authentication
router.post('/login', login)
router.post('/register', register)
router.post('/verify', verifyAndRegister)

//Forogot password
router.route('/accounts/password')
    .post(forgetPassword)
    .put(resetPassword)

module.exports = router;