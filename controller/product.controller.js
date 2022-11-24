const { cloudinary } = require("../utils/clodinary")
const productModel = require('../Model/product');
const { isValidObjectId } = require("mongoose");
const cart = require("../Model/cart");
const product = require("../Model/product");
const User = require("../Model/user")

const ObjectId = require('mongoose').Types.ObjectId

exports.addProduct = async (req, res) => {
    // take images from request ?
    // set product details in a variable ?
    //multer
    // add images to cloudinary ?

    // add to database ?
    const productDetails = req.body;
    console.log(req.body);
    try {
        const product = await productModel.create(productDetails)
        return res.status(201).json({
            message: 'success', productId: product.id
        })

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            message: "failed", error: error.message
        })
    }
}

exports.getAllProducts = async(req,res) => {
    try {

        const productsPromise =  productModel.find().populate('category.id')
        const countPromise = productModel.count()

        const [products,count] = await Promise.all([productsPromise,countPromise])

        if(!count){
            return res.status(404).json({
                message : 'No products found'
            })
        }
        return res.status(200).json({products,count})
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            message : error.message
        })
    }
}

exports.getProduct = async(req,res)=>{
    const id = req.user.id;

    if(!isValidObjectId(id)){
        return res.status(400).json({
            message : "Invalid request"
        })
    }

    const product = await productModel.findById(id).populate('category.id');

    if(!product){
        return res.status(404).json({
            message : "No product found"
        })
    }

    return res.status(200).json(product);
}

exports.addTocart = async(req,res)=>{
    
    
    try {
        const {userId} = req.user.id;
        const {quantity} = req.body;
        const productDetails = req.body;

        const prodouct = await product.findById(productDetails.productId);

        console.log(prodouct);

        if(!product){
            return res.status(404).json({
                message : "No products found"
            })
        }

        if(!prodouct.size.includes(productDetails.size)){
            return res.status(400).json({
                message : "Invalid size"
            })
        }

        if(!prodouct.colors.some((c)=> c.color == productDetails.color)){
            return res.status(400).json({
                message : "Invalid color"
            })
        }


        
        const cartExists = await cart.findOne({user : userId})
    
        if(cartExists){
            const productExist = await cart.findOne({
                user : userId,
                'products.product' : productDetails.productId,
                'products.size' : productDetails.size,
                'products.color' : productDetails.color
            })
    
            if(productExist){

                const m = await cart.findOneAndUpdate({user : userId,products : {$elemMatch: { prodouct : productDetails.productId }}},{
                    $inc : {
                        'products.$.quantity' : 1
                    }
                })

            }else{
    
                await cart.updateOne({user : userId},{
                    $push : {
                        products : {product : productDetails.productId ,quantity : quantity , ...productDetails }
                    }
                })
            }
    
            }else{
            const cartItem = {
                user : userId,
                products : [
                    {
                        product : productDetails.productId,
                        quantity ,
                        ...productDetails
                    }
                ]
            }

            const userCart = await cart.create(cartItem)
        }
    
        return res.status(201).json({
            success : true,
            message : "Added to cart"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "failed",
            error : error.message
        })
    }
}

exports.getCart = async(req,res)=>{
    const userId = req.user.id;
    console.log(userId);
    try {
        if(!isValidObjectId(userId)) 
        return res.status(400).json({message : "Invalid Request" })

        const cartItems = await cart.findOne({user : userId}).populate('products.product',{
            price:1,
            name :1,
            inventory : 1,
            description : 1,
            ratings : 1,
            colors : 1,
            offer: 1
        }).exec()

        console.log(cartItems);

        // const cartObj = {
        //     _id : cartItems._id,
        //     user : cartItems.user,
        //     products : 
        // }
        // cartItems.products.forEach( product  => {
        //     product.product.size = product.size   
        //     product.product.color = product.color
        //     delete product.color
        //     delete product.size
        // });

        console.log(cartItems);

        if(!cartItems){
            return res.status(404).json({
                message : "No cart found!"
            })
        }

        if(!cartItems?.products?.length){
            return res.status(404).json({
                message : "No items in the cart!"
            })
        }

        return res.status(200).json(cartItems)


    } catch (error) {
        
    }
}

exports.addToWishlist = async (req,res)=>{
 try {
    const {productId} = req.body
    const userId = req.user.id
    if (!productId || !userId) {
        return res.status(404).json({message:"Provide Credentials"})
    }

    const productExist = await User.findOne({ _id : userId , wishlist :  productId })
    console.log(productExist);

    if(productExist){
        return res.status(403).json({
            success : false,
            message : "Product already exists in wishlist"
        })
    }

    await User.updateOne({_id : userId},{
        $push : {
            wishlist : productId
        }
    })

    return res.status(201).json({
        success : true,
        message : 'Product added to wishlist'
    })
    
 } catch (error) {
    return res.status(500).json({message:error.message})
 }
}

exports.getWishlist = async (req,res) => {
    try {
        const userId = req.user.id;
        console.log(userId);
        const [user] = await User.aggregate([
            {$match : { _id : ObjectId(userId) }},
            {
                $lookup : {
                    localField : 'wishlist',
                    foreignField : '_id',
                    from : 'products',
                    as : 'products'
                }
            }
        ])

        

        if(!user.products.length){
            return res.status(404).json({
                success : false,
                message : "Wishlist is empty!"
            })
        }



        return res.status(200).json(user.products)

    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

exports.removeFromWishlist = async(req,res) => {
    try {
        const userId = req.user.id
        const productId = req.params.id

        const result  = await User.updateOne({_id : userId},{
            $pull : {
                wishlist : productId
            }
        })

        console.log(result);

        return res.status(200).json({
            success : true
        })

    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}