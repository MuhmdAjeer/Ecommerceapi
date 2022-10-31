const jwt = require('jsonwebtoken')

module.exports = {
    generateJWT: (id, name) => {
        return jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: '30d' })
    }
}