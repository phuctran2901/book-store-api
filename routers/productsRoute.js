const express = require('express');
const Router = express.Router();
const {
    getOneProduct,
    createOneProducts,
    editProduct,
    deleteOneProduct,
    getProductByPage,
    addReviewToProduct,
    searchKeywordText,
    changeCategoryProduct } = require('../controllers/productController');
const { verifyToken } = require('../middleware/verifyToken');

Router.route('/category').post(verifyToken, changeCategoryProduct);


Router.route("/search").get(searchKeywordText);

Router.route('/').get(getProductByPage);

Router.route('/:productID').get(getOneProduct);

Router.route('/').post(verifyToken, createOneProducts);

Router.route('/:productID').post(verifyToken, editProduct).delete(verifyToken, deleteOneProduct);

Router.route('/review/:productID').post(verifyToken, addReviewToProduct);


module.exports = Router;