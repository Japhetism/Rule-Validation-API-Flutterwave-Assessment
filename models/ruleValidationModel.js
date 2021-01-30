const mongoose = require('mongoose');
const validator = require('validator');

const ruleValidationSchema = new mongoose.Schema({
    rule: {
        type: Object,
        required: [true, 'rule is required']
    },
    data: {
        type: Object,
        required: [true, 'data is required']
    }
});

const RuleValidation = mongoose.model('RuleValidation', ruleValidationSchema);
module.exports = RuleValidation;