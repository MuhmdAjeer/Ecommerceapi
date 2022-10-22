const express = require('express')
const router = express.Router()
const {register, verifyOtp, login} = require('../controller/authController')


router.post('/login',login)
router.post('/register',register)
router.post('/verifyOtp',verifyOtp)

module.exports = router;