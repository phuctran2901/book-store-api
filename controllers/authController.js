const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bycript = require('bcryptjs');
exports.register = async (req, res, next) => {
    try {
        const email = await User.find({ email: req.body.email });
        if (email.length !== 0) {
            res.json({
                status: "failed",
                messenger: "Email đã có người sử dụng"
            });
            res.end();
        }
        const user = await User.create({ ...req.body });
        const token = jwt.sign({ userID: user.id }, process.env.APP_SECERT);
        res.status(200).json({
            status: "success",
            token: token
        })

    }
    catch (err) {
        console.log("Err", err)
    }
}


exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).json({
                status: 'failed',
                messenger: 'Email không hợp lệ'
            })
        }
        if (bycript.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({ userID: user.id }, process.env.APP_SECERT);
            console.log(user)
            res.status(200).json({
                status: "success",
                token: token,
                user: {
                    id: user._id,
                    cart: user.cart,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phone: user.phone,
                    image: user.image,
                    address: user.address
                }
            })
        }
        else {
            console.log('Password sai');
        }
    }
    catch (err) {
        console.log("Err", err)
    }
}

exports.getCurrentUser = async (req, res, next) => {
    try {
        const { userID } = req.user;
        if (userID) {
            const user = await User.findById(userID);
            res.status(200).json({
                status: 'success',
                user
            })
        }
    }
    catch (err) {
    }
}

exports.loginAdmin = async (req, res, next) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            res.json({
                status: 'failed',
                messenger: "Không tìm thấy email"
            })
        }
        if (bycript.compareSync(password, user.password)) {
            if (user.role === 'admin') {
                const token = jwt.sign({ userID: user.id }, process.env.APP_SECERT);
                res.status(200).json({
                    status: "success",
                    token: token,
                    user: {
                        id: user._id,
                        cart: user.cart,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        phone: user.phone,
                        address: user.address,
                        image: user.image
                    }
                })
            }
        }
        else {
            res.json({
                status: "failed",
                messenger: "Sai tài khoản hoặc mật khẩu"
            })
        }
    }
    catch (err) {
        console.log("Err", err)
    }
}