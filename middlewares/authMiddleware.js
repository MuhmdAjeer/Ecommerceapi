const jwt = require('jsonwebtoken')
const User = require('../Model/user')

exports.verify = async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            

            const user = await User.findById(decoded.id)

            if (user.blocked) {
                return res
                    .status(403)
                    .json({
                        message:
                            'You are currently blocked for violating cleverHires Terms and conditions',
                    })
            }

            req.user = {
                id: decoded.id,
                name: decoded.name,
            }
            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({ message: 'Not authorized' })
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized , No token' })
    }
}