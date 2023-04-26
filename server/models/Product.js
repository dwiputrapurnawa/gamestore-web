const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title must required"]
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    img: [{uid: String, name: String, url: String}],
    tags: [String],
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;