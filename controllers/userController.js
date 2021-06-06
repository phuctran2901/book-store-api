const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bycript = require('bcryptjs');
const lodash = require('lodash');
const cloudinary = require('../untils/cloudinary');

exports.editProfile = async (req, res, next) => {
    try {
        const { userID } = req.user;
        const uploader = async (path) => await cloudinary.uploads(path, 'avatar');
        const data = JSON.parse(req.body.user);
        let url = null;
        const files = req.files[0];
        if (files) {
            const { path } = files;
            url = await uploader(path);
            data.image = url.url;
        }
        if (data.password) {
            const user = await User.findById(userID);
            user.password = data.password;
            user.save();
            delete data.password;
        }
        const userUpdate = await User.findByIdAndUpdate(userID, data, { runValidators: true, new: true })
        res.json({
            status: "success",
            user: userUpdate
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.changeRoleByAdmin = async (req, res, next) => {
    try {
        const { userID } = req.user;
        const admin = await User.findById(userID);
        if (admin.role === 'admin') {
            const userUpdate = await User.findByIdAndUpdate(req.body.userID, {
                role: req.body.role
            });
            res.json({
                status: 'success',
                userUpdate
            })
        }
        else {
            res.json({
                status: "failed",
                messenger: "Ban khong phai admin"
            })
        }
    }
    catch (err) {

    }
}

exports.deleteOneUser = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const user = await User.findByIdAndDelete(userID);
        res.json({
            status: "success"
        })
    }
    catch (err) {
        res.json({
            status: 'failed',
            messenger: err
        })
    }
}

exports.getAllUser = async (req, res, next) => {
    try {
        let limit = Math.abs(req.query.limit) || 5;
        let page = (Math.abs(req.query.page) || 1) - 1;
        const users = await User.find({})
            .populate('cart.product')
            .limit(limit)
            .skip(page * limit)
            .sort('role')
            .sort('-createdAt');
        let slUser = await User.find({});
        let totalPage = Math.ceil(slUser.length / limit);
        res.status(200).json({
            status: "success",
            result: users.length,
            users: users,
            totalPage: totalPage
        })
    }
    catch (err) {
        console.log(err)
    }
}


exports.getOneUser = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const user = await User.findById(userID).populate('cart');
        res.status(200).json({
            status: "success",
            user
        })
    }
    catch (err) {

    }
}

// Cart by user

exports.addOneProductOrUpdateToCart = async (req, res, next) => {
    try {
        const { userID } = req.user;
        const data = req.body;
        const user = await User.findById(userID);
        let index = await lodash._.findIndex(user.cart, (cart) => cart.product == data.product);
        if (index !== -1) {
            user.cart[index] = data;
            user.save();
        } else {
            user.cart.push(data);
            user.save();
        }
        res.status(200).json({
            status: "success",
            user
        })
    }
    catch (err) {

    }
}

exports.deleteProductToCart = async (req, res, next) => {
    try {
        const { userID } = req.user;
        const { productID } = req.params;
        const user = await User.findById(userID);
        let index = await lodash._.findIndex(user.cart, (cart) => cart.product == productID);
        if (index !== -1) {
            user.cart.splice(index, 1);
            user.save();
        } else {
            console.log("ERR")
        }
        res.status(200).json({
            status: "success"
        })
    }
    catch (err) {

    }
}

exports.searchUserByEmail = async (req, res, next) => {
    try {
        const { keyword } = req.body;
        const user = await User.find({
            email: { $regex: keyword, $options: "i" }
        }).limit(5);
        res.json({
            status: "success",
            user
        })
    }
    catch (err) {
        console.log(err);
    }
}