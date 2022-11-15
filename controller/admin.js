const Admin = require('../Model/admin')
const bcrypt = require('bcryptjs');
const fs = require('fs')

const { generateJWT } = require('../utils/jwt');
const Category = require('../Model/category');
const SubCategory = require('../Model/subCategory');

const { cloudinary } = require('../utils/clodinary');
const { isValidURL } = require('../utils/utils');
const path = require('path');
const category = require('../Model/category');

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body
        try {
            const admin = await Admin.findOne({ email: email });
            if (!admin) return res.status(404).json({ message: "admin not found" });

            const passwordMatch = await bcrypt.compare(password, admin.password);
            if (!passwordMatch) return res.status(401).json({ message: "Password doesnt match" });

            return res.status(200).json({
                message: "success",
                token: generateJWT(admin._id, "admin")
            })
        } catch (error) {
            a
            return res.status(500).json({ message: "Login failed" })
        }
    },

    // {category : name , icon : url/image} ======> request body
    addCategory: async (req, res) => {
        let { category } = req.body;
        let {icon} = req.files || req.body;
        icon = icon.tempFilePath;
        category = category.toUpperCase()
        try {
            const exist = await Category.findOne({ category });
            if (exist) return res.status(403).json({ message: "Category already exists" });

            let iconUrl = icon;

            //if icon image is not a url upload image to cloudinary
            if (!isValidURL(icon)) {
                const uploadResult = await cloudinary.uploader.upload(icon, {
                    upload_preset: "category"
                })
                iconUrl = uploadResult.url;
            }

            const categoryDetails = await Category.create({ category, icon: iconUrl });
            // console.log(__filename+'../tmp');
            const path = path.join(__dirname,'../tmp')
            console.log({path});
            fs.rmSync(path,{recursive: true, force: true})
            return res.status(201).json({
                message: "category added",
                category: {
                    id: categoryDetails.id,
                    name: categoryDetails.category,
                    iconUrl: categoryDetails.icon
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "failed to add category",
                error: error
            })
        }
    },

    // {category : name , icon : url/image} ===> request body
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.find().populate('subCategories');
            if(!categories.length){
                return res.status(404).json({
                    message : 'no categories found'
                })
            }
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ 
                message: "cant get categories" , error : error.message
            });
        }
    },

    // id : number =======> request params 
    deleteCategory: async (req, res) => {
        const categoryId = req.params.id
        try {
            const category = await Category.findOne({ id: categoryId });
            if (!category) return res.status(404).json({ message: "requested category to delete is not found" });

            await Category.deleteOne({ id: categoryId });
            res.status(204).json('success')
        } catch (error) {
            res.status(500).json({ message: "cant delete category" });
        }
    },

    // id : number =======> request params 
    getOneCategory: async (req, res) => {
        const { id } = req.params;
        try {
            const category = await Category.findOne({ id })
            if (!category) return res.status(404).json({ message: "requested category not found" })

            delete category._id
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json(error)
        }
    },


    // <<<<<<<<<<<<<<<SUBCATEOGIRES>>>>>>>>>>>>>>>>>>>>>>
    addSubCategory: async (req, res) => {
        let { name } = req.body;

        name = name.toUpperCase()
        console.log(req.body);
        try {
            const exist = await SubCategory.findOne({ name });
            if (exist) return res.status(403).json({ message: "sub-category already exists" });
            
            const subCategory = await SubCategory.create({ name });
            await category.updateOne({_id : req.body.category},{
                $push : { subCategories : subCategory.id }
            })
            return res.status(201).json({
                message: "sub-category added",
                subCategory: {
                    id: subCategory.id,
                    name : subCategory.name,
                    category : req.body.category,
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "failed to add category",
                error: error
            })
        }
    }
}