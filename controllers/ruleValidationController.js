const RuleValidation = require('../models/ruleValidationModel');
const base = require('./baseController');

exports.getAllusers = base.getAll(RuleValidation);
exports.createRuleValidation = base.createOne(RuleValidation);
exports.getAuthorRuleValidation = base.getAuthorRuleValidation(RuleValidation);