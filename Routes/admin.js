const express = require('express')
const router = express.Router()

const {login} = require('../controller/admin');

//AUTH
router.post('/login',login);











module.exports = router;