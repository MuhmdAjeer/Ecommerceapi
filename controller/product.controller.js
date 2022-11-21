const { cloudinary } = require("../utils/clodinary")
const productModel = require('../Model/product');
const { isValidObjectId } = require("mongoose");
const cart = require("../Model/cart");
const product = require("../Model/product");

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
    const {id} = req.params;

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
        const {userId} = req.params;
        const {quantity} = req.body;
        const productDetails = req.body;

        const prodouct = await product.findById(productDetails.productId);

        console.log(product);

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
    const {userId} = req.params;
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