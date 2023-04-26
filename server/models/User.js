const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true
    },
    password: {
        type: String,
        min: 8,
        required: true,
    },
    name: String,
    email: {
        type: String,
        unique: [true, "email already taken"]
    },
    cart: [{type: mongoose.Types.ObjectId, ref: "Product"}],
    role: {
        type: String,
        enum: ["User"]
    },
    gender: {
        type: String,
        enum: ["Male", "Female"]
    },
    birthday: Date,
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;