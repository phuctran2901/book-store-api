const express = require('express');

const Router = express.Router();
const {
    editProfile,
    getAllUser,
    getOneUser,
    addOneProductOrUpdateToCart,
    deleteProductToCart,
    deleteOneUser,
    searchUserByEmail,
    changeRoleByAdmin } = require('../controllers/userController');
const { verifyToken } = require('../middleware/verifyToken');

Router.route('/').post(verifyToken, editProfile)

Router.route("/search").post(searchUserByEmail);

Router.route('/role').post(verifyToken, changeRoleByAdmin);

Router.route('/').get(getAllUser);

Router.route('/:userID').get(getOneUser);

Router.route('/:userID').delete(deleteOneUser);
// Cart

Router.route('/cart').post(verifyToken, addOneProductOrUpdateToCart);

Router.route("/cart/:productID").delete(verifyToken, deleteProductToCart);

module.exports = Router;