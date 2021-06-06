
const Orders = require('../models/orders');
const User = require('../models/user');
exports.getAllOrders = async (req, res, next) => {
    try {
        const { status } = req.query;
        if (Number(status) === -1) {
            const orders = await Orders.find({})
                .populate('productDetail.productID')
                .populate('saleCode', 'code type discount')
                .populate('userID')
                .sort('-createdAt');
            res.status(200).json({
                status: "success",
                orders,
                ordersTotal: orders.length
            })
        }
        else {
            const orders = await Orders.find({ status: status })
                .populate('productDetail.productID')
                .populate('userID')
            res.status(200).json({
                status: "success",
                orders,
                ordersTotal: orders.length
            })
        }
    }
    catch (err) {

    }
}

exports.changeStatusOrders = async (req, res, next) => {
    try {
        const { userID } = req.user;
        const admin = await User.findById(userID);
        const orderID = req.body.orderID;
        if (admin.role === 'admin') {
            // 0 : Chờ xác nhận
            // 1 : Đã xác nhận
            // 2 : Đang giao hang
            // 3 : đã giao hàng
            const newOrders = await Orders.findByIdAndUpdate(orderID, {
                status: Number(req.body.status)
            })
            res.json({
                status: "success",
                newOrders
            })
        }
        else {
            res.json({
                messenger: "Ban khong phai admin"
            })
        }
    }
    catch (err) {

    }
}

exports.createOrders = async (req, res, next) => {
    try {
        const data = req.body;
        await Orders.create({ ...data });
        res.status(200).json({
            status: "success"
        })
    }
    catch (err) {

    }
}


exports.deleteOneOrder = async (req, res, next) => {
    try {
        const { userID } = req.user;
        const admin = await User.findById(userID);
        const { id } = req.params;
        if (admin.role === 'admin') {
            const deleteOrder = await Orders.findByIdAndDelete(id);
            res.json({
                status: "success",
                deleteOrder
            })
        }
        else {
            res.json({
                messenger: "Ban khong phai admin"
            })
        }
    }
    catch (err) {
        res.json({
            err: err
        })
    }
}
