const express = require('express')
const router = express.Router()

const { login, addCategory, getAllCategories, deleteCategory, getOneCategory, addSubCategory } = require('../controller/admin');

//AUTH
router.post('/login', login);

// category
router.route('/categories')
    .post(addCategory) // upload a category
    .get(getAllCategories) // to get all categories

router.route('/category/:id')
    .get(getOneCategory) // get one category by id
    .delete(deleteCategory) // delte one category by id

router.route('/sub-category')
    .post(addSubCategory)













module.exports = router;