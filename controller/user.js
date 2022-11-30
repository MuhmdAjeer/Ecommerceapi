const { isValidObjectId } = require('mongoose');
const UserModel = require('../Model/user')
const ObjectId = require('mongoose').Types.ObjectId

exports.addAddress = async(req,res)=>{
    try {
        const {address,city,pincode,name,phone} = req.body;
        const userId = req.user.id
        console.log();
        if(!address || !city || !pincode || !phone || !name ){
            return res.status(400).json({message : 'Provide full details',
            success:false,})
        }
        if(phone.toString().length != 10){
            return res.status(400).json({message : 'Invalid phone number',
            success:false,})
        }

        const addressBody = {
            userId,
            address,
            city,
            pincode,
            phone,
            name
        }

        await UserModel.updateOne({_id : userId},{
            $push : {
                addresses : addressBody 
            }
        })
        
        return res.status(201).json({
            message : 'Address added',
            success:true,
        })

    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}

exports.getAddresses = async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId)

        if(!user.addresses.length){
          return  res.status(404).json({message : 'No addresses found!'})
        }

        res.status(200).json(user.addresses);
        

    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}

exports.deleteAddress = async(req,res)=>{
    try {
        const userId = req.user.id
        const addressId = req.params.id;

        if(!isValidObjectId(addressId)){
            return res.status(409).json({
                message : 'Invalid Address id provided'
            })
        }
        const {modifiedCount,matchedCount} = await UserModel.updateOne({_id : userId},{
            $pull : {addresses : {_id : ObjectId(addressId) }}
        })

        if(!modifiedCount || !matchedCount){
            return res.status(400).json({
                message : 'failed to find address and delete'
            })
        }

        res.status(200).json({
            message : 'Address deleted'
        })

    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}