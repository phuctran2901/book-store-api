const express = require('express');

const { verifyToken } = require('../middleware/verifyToken');
const Router = express.Router();

const { getAllOrders, createOrders, changeStatusOrders, deleteOneOrder } = require('../controllers/ordersController');
Router.route('/').get(getAllOrders);
Router.route('/').post(createOrders);
Router.route('/status').post(verifyToken, changeStatusOrders);
Router.route('/:id').delete(verifyToken, deleteOneOrder);


module.exports = Router;