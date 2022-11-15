const { cloudinary } = require("../utils/clodinary")
const productModel = require('../Model/product')

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

        const productsPromise =  productModel.find()
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