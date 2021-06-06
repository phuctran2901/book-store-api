const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    urls: { type: Array, require: true },
    author: { type: String, require: true },
    review: [
        {
            userID: { type: mongoose.Schema.Types.ObjectId, ref: "user", require: true },
            stars: { type: Number, require: true },
            content: { type: String, require: true }
        }
    ],
    price: { type: Number, require: true },
    inStock: { type: Number, require: true },
    types: { type: mongoose.Schema.Types.ObjectId, ref: "type", required: true },
    language: { type: String },
    publicCompany: { type: mongoose.Schema.Types.ObjectId, ref: 'nxb', require: true },
    category: [
        { type: String, require: true }
    ],
    publicYear: { type: Number, require: true },
    pages: { type: Number, require: true, default: 0 }
}, { timestamps: true })

const product = mongoose.model("products", productSchema);

module.exports = product;