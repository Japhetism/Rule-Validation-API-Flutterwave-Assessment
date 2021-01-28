const mongoose = require('mongoose');
const validator = require('validator');

const ruleValidationSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please fill your name']
    },
    email: {
        type: String,
        required: [true, 'Please fill your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valida email']
    }
});

const RuleValidation = mongoose.model('RuleValidation', ruleValidationSchema);
module.exports = RuleValidation;