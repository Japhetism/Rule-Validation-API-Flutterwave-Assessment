const express = require('express');
const router = express.Router();
const ruleValidationController = require('../controllers/ruleValidationController');

router
    .route('/')
    .get(ruleValidationController.getAuthorRuleValidation);

router
    .route('/')
    .post(ruleValidationController.createRuleValidation);

module.exports = router;