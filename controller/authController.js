const asyncWrapper = require('express-async-handler');
const bcrypt = require('bcryptjs')

const { generateJWT } = require('../utils/jwt')
const User = require('../Model/user')
const { sendOtp, verifyOtp } = require('../utils/otp');


module.exports = {
    register: asyncWrapper(async (req, res) => {
        const { username, email, password, phone } = req.body;

        if (!username || !email || !password || !phone) {
            res.status(404)
            throw new Error('Please provide full credentials!');
        }

        let exists = await User.findOne({ email: email })

        if (exists) {
            res.status(400)
            throw new Error('User already exists')
        }

        try {
            await sendOtp(email)
            res.status(200).json({
                status: 'Ok',
                message: 'OTP send successfully',
                user: { email, username, phone }
            })
        } catch (err) {
            res.status(500)
            throw new Error('Cannot send OTP! try again')
        }
    }),

    verifyAndRegister: asyncWrapper(async (req, res) => {

        let { username, email, phone, password } = req.body.user;
        let code = parseInt(req.body.code)

        if (code != 1234) {
            res.status(400)
            throw new Error('Invalid OTP')
        }

        try {
            const verified = await verifyOtp(email, code)

            if (!verified) {
                res.status(400)
                throw new Error('OTP verification failed')
            }

            const user = await User.create({
                username: username,
                email: email,
                password: (await bcrypt.hash(password, 10)),
                phone: phone
            })

            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.username,
                token: generateJWT(user.id, user.username)
            })

        } catch (error) {
            throw new Error(error)
        }

    }),


    login: asyncWrapper(async (req, res) => {

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400)
            throw new Error('Provide full credentials')
        }

        const user = await User.findOne({ email })
        if (!user) {
            res.status(404)
            throw new Error('No Users found!')
        }

        if ((await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                username: user.username,
                email: user.email,
                phone: user.phone,
                token: generateJWT(user._id, user.username)
            })
        } else {
            res.status(400)
            throw new Error('Email and password doesnt match!')
        }
    }),

    SendOTP: async (req, res) => {
        try {
            await sendOtp(req.body.email)
            res.status(200).json({
                status: ok, message: "OTP send successfully"
            })
        } catch (error) {
            throw new Error(error)
        }
    },
    verifyOTP: async (req, res) => {
        const { email, otp } = req.body;
        try {
            const verified = await verifyOtp(email, otp);
            if (!verified) {
                res.status(400)
                throw new Error('OTP verifcation failed!')
            }
            res.status(200).json({
                status: ok, message: "OTP verification success"
            })
        } catch (error) {
            throw new Error(error)
        }
    },
    forgetPassword: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({
                    message: "No users found with this email address"
                })
            }

            sendOtp(email).then(() => {
                return res.status(200).json({
                    message: "OTP send successfully"
                })
            }).catch((err) => {
                return res.status(500).json({ message: "Cant send OTP" })
            })

        } catch (error) {
            res.status(500).json(error);
        }
    },
    resetPassword: async (req, res, next) => {
        const { email, password, otp } = req.body;
        try {
            const verified = await verifyOtp(email, otp);
            console.log(verified);
            if (!verified) {
                return res.status(401).json({
                    message:"Invalid OTP"
                })
            }
            const hashedPassword = await bcrypt.hash(password,10);
            const user = User.updateOne({email},{password : hashedPassword})
            return res.status(200).json({
                message:"Password updates succesfully"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

