const asyncWrapper = require('express-async-handler');
const User = require('../Model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken)

module.exports = {
    register : asyncWrapper(async(req,res,next)=>{
        console.log(req.body);
        const {username , email,password,phone} = req.body;

        if(!username || !email || !password || !phone){
            res.status(404)
            throw new Error('Please provide full credentials!');
        }

        let exists = await User.findOne({email:email})
        
        if(exists){
            res.status(400)
            throw new Error('User already exists')
        }

        // client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
        //         .verifications.create({
        //             to: `+91${phone}`, 
        //             channel: 'sms'
        //         }).then(({status})=> {
        //             res.status(200).json({ status , user : req.body })
        //         }).catch((err)=> console.log(err))

        res.status(200).json(req.body)



    }),
    verifyOtp : asyncWrapper(async(req,res)=>{

        let {username,email,phone,password} = req.body;
        code = parseInt(req.body.code)

        if(code != 1234){
            res.status(400)
            throw new Error('Invalid OTP')
        }

        // client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
        // .verificationChecks
        // .create({to: `+91${body.user.phone}`, code: body.code })
        // .then(async({status})=> {

        const user = User.create({
            username : username,
            email : email,
            password : (await bcrypt.hash(password,10)),
            phone : phone
        })

            res.status(201).json({
                _id : user.id,
                username : user.username,
                email : user.username,
                token : generateJWT(user.id,user.username)
            })
        })
        // .catch((err)=> {
        //     res.status(400)
        //     throw new Error('OTP verification failed')
        // })
        // })
        ,
    
    login : asyncWrapper(async(req,res)=>{

        const {email,password} = req.body;

        if(!email || ! password){
            res.status(400)
            throw new Error('Provide full credentials')
        }

        const user = await User.findOne({email})
        if(!user){
            res.status(404)
            throw new Error('No Users found!')
        }

        if((await bcrypt.compare(password,user.password))){
            res.status(200).json({
                username : user.username,
                email : user.email,
                phone : user.phone,
                token : generateJWT(user._id,user.username)
            })
        }else{
            res.status(400)
            throw new Error('Email and password doesnt match!')
        }
    })


}

const generateJWT = (id,name) => {
    return jwt.sign({id , name}, process.env.JWT_SECRET , {expiresIn : '30d'})
}