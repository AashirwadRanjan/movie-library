const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        min: 5
    }
});

userSchema.pre("save", async function(next) {
    let salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Export the User model without redefining it
module.exports = mongoose.model('User', userSchema);
