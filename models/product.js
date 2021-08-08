const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    urls: { type: Array, require: true },
    author: { type: String, require: true },
    sale: { type: Number, default: 0 },
    review: [
        {
            userID: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
            stars: { type: Number, required: true },
            date: { type: Date, required: true },
            content: { type: String, required: true }
        }
    ],
    price: { type: Number, require: true },
    inStock: { type: Number, require: true },
    types: { type: mongoose.Schema.Types.ObjectId, ref: "type", required: true },
    publicCompany: { type: mongoose.Schema.Types.ObjectId, ref: 'nxb', require: true },
    category: [
        { type: String, require: true }
    ],
    publicYear: { type: Number, require: true },
    pages: { type: Number, require: true, default: 0 },
    averagedStars: { type: Number, default: 0 }
}, { timestamps: true })
productSchema.index({ title: "text" });
const product = mongoose.model("products", productSchema);

module.exports = product;