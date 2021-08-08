

const Product = require("../models/product");
const User = require("../models/user");
const _ = require('lodash');
const cloudinary = require('../untils/cloudinary');
const fs = require('fs');

exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('review.userID', 'firstName lastName')
            .populate('types', 'name')
            .populate('publicCompany', 'name')
            .sort("-createdAt");
        res.json({
            status: "success",
            products
        })
    }
    catch (err) {
        res.json({
            status: "failed",
            err
        })
    }
}

exports.getProductByPage = async (req, res, next) => {
    try {
        let limit = Math.abs(req.query.limit) || 5;
        let page = (Math.abs(req.query.page) || 1) - 1;
        const products = await Product.find({})
            .limit(limit)
            .skip(page * limit)
            .populate('review.userID', 'firstName lastName')
            .populate('types', 'name')
            .populate('publicCompany', 'name')
            .sort('-createdAt');
        let slProduct = await Product.find({});
        let totalPage = Math.ceil(slProduct.length / limit);
        res.status(200).json({
            status: "success",
            result: products.length,
            products: products,
            totalPage: totalPage
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.getOneProduct = async (req, res, next) => {
    try {
        const { productID } = req.params;
        const product = await Product.findById(productID)
            .populate('review.userID', 'firstName lastName image')
            .populate('publicCompany', '_id name')
            .populate('types', '_id name');
        res.status(200).json({
            status: "success",
            product
        })
    }
    catch (err) {
        res.json({
            status: "failed",
            messenger: "Không tìm thấy ID"
        })
    }
}



exports.createOneProducts = async (req, res, next) => {
    try {
        const { userID } = req.user;
        const admin = await User.findById(userID);
        const uploader = async (path) => await cloudinary.uploads(path, 'dev_setups');
        const urls = [];
        const files = req.files;
        const data = JSON.parse(req.body.product);
        const { title, author, description, publicYear, inStock, price, publicCompany, types, pages, sale } = data;
        if (admin.role === 'admin') {
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                urls.push(newPath);
                fs.unlinkSync(path);
            }
            const product = await Product.create({
                title: title,
                author: author,
                description: description,
                publicYear: publicYear,
                inStock: inStock,
                price: price,
                publicCompany: publicCompany,
                types: types,
                urls: urls,
                pages: pages,
                sale: sale
            })
            res.status(200).json({
                status: "success",
                product
            })
        }
    }
    catch (err) {

    }
}

exports.editProduct = async (req, res, next) => {
    try {
        const { userID } = req.user;
        const user = await User.findById(userID);
        const uploader = async (path) => await cloudinary.uploads(path, 'dev_setups');
        const urls = [];
        const files = req.files;
        const { productID } = req.params;
        const data = JSON.parse(req.body.product);
        const { title, author, description, publicYear, inStock, price, publicCompany, types, pages, sale } = data;
        if (files.length !== 0) {
            if (user.role === "admin") {
                for (const file of files) {
                    const { path } = file;
                    const newPath = await uploader(path);
                    urls.unshift(newPath);
                    fs.unlinkSync(path);
                }
                data.urls.map(url => {
                    urls.push(url)
                })
                const newProduct = await Product.findByIdAndUpdate(productID, {
                    title: title,
                    author: author,
                    description: description,
                    publicYear: publicYear,
                    inStock: inStock,
                    price: price,
                    publicCompany: publicCompany,
                    types: types,
                    urls: urls,
                    sale: sale,
                    pages: pages
                }, { runValidators: true, new: true })
                res.status(200).json({
                    status: "success",
                    newProduct
                })
            }
            else {
                res.json({
                    messenger: "Không đủ quyền"
                })
            }
        }
        else {
            const newProduct = await Product.findByIdAndUpdate(productID, {
                title: title,
                author: author,
                description: description,
                publicYear: publicYear,
                inStock: inStock,
                price: price,
                publicCompany: publicCompany,
                types: types,
                urls: data.urls,
                pages: pages,
                sale: sale
            }, { runValidators: true, new: true })
            res.status(200).json({
                status: "success",
                newProduct
            })
        }
    }
    catch (err) {

    }
}

exports.deleteOneProduct = async (req, res, next) => {
    try {
        const { userID } = req.user;
        const user = await User.findById(userID);
        if (user.role === "admin") {
            const { productID } = req.params;
            const product = await Product.findByIdAndDelete(productID);
            res.status(200).json({
                status: "success"
            })
        }
        else {
            console.log("ban k phai admin")
        }
    }
    catch (err) {

    }
}

exports.addReviewToProduct = async (req, res, next) => {
    try {
        const { userID } = req.user;
        const { productID } = req.params;
        const data = req.body;
        data.userID = userID;
        const product = await Product.findById(productID)
            .populate('review.userID', 'firstName lastName image');
        product.review.unshift(data);
        const averagedStars = product.review.reduce((t, c) => {
            return t + c.stars;
        }, 0)
        product.averagedStars = averagedStars / product.review.length;
        product.save(function (err, result) {
            if (err) {
                res.json({
                    status: "failed",
                    err
                })
            }
            else {
                res.json({
                    status: "success",
                    result
                })
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}



exports.changeCategoryProduct = async (req, res, next) => {
    try {
        const data = req.body;
        const product = await Product.findById(data.id);
        if (data.status) {
            product.category.push(data.category);
            product.save();
        }
        else {
            let index = _.findIndex(product.category, e => e === data.category, 0);
            if (index !== -1) {
                product.category.splice(index, 1);
            }
            product.save();
        }
        res.json({
            status: "success",
            product
        })
    }
    catch (err) {
        res.json({
            status: "failed",
            err
        })
    }
}

exports.searchKeywordText = (req, res, next) => {
    try {
        const { keyword } = req.query;
        Product.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } }
            ]
        }
        ).limit(5)
            .then(data => {
                res.json({
                    status: "success",
                    products: data
                })
            })
            .catch(err => {
                res.json({
                    status: 'failed',
                    errors: err
                })
            });
    }
    catch (err) {
        console.log(err);
    }
}

exports.searchProductByField = async (req, res) => {
    try {
        const title = req.body.title;
        const data = req.body;
        delete data.title;
        if (title !== "") {
            data.$text = {
                $search: title
            }
        }
        if (data.publicCompany === "") delete data.publicCompany;
        if (data.types === "") delete data.types;
        const searchResult = await Product.find({ ...data })
            .populate('review.userID', 'firstName lastName')
            .populate('types', 'name')
            .populate('publicCompany', 'name')
        res.json({
            status: "success",
            searchResult
        })
    }
    catch (err) {
        res.json({
            status: "failed",
            err
        })
    }
}

exports.filterByPrice = async (req, res) => {
    try {
        const searchResult = await Product.find({
            $and: [
                {
                    price: { $lte: 500000 }
                },
                {
                    price: { $gt: req.body.reqPrice }
                }
            ]
        })
            .populate('review.userID', 'firstName lastName image')
            .populate('publicCompany', '_id name')
            .populate('types', '_id name')
            .limit(9);
        res.json({
            status: "success",
            products: searchResult
        })
    }
    catch (err) {
        res.json({
            status: "failed",
            err
        })
    }
}