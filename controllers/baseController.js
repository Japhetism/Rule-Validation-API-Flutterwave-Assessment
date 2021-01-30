const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Author = require('../fixtures/author_info');
const { check, validationResult } = require('express-validator')
const RuleValidator = require('../validator/ruleValidator');
const Helper = require('../utils/helper');

exports.getAuthorRuleValidation = Model => async (req, res, next) => {
    return res.status(process.env.HTTP_OK_STATUS_CODE).json({
        message: "My Rule-Validation API",
        status: process.env.SUCCESS_STATUS,
        data: Author.getAuthorInfo()
    })
}

exports.deleteOne = Model => async (req, res, next) => {
    try {
        const id = req.params.id;
        const doc = await Model.findByIdAndDelete(id);

        if(!doc) {
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, `No document found with this id ${id}`), req, res, next);
        }

        res.status(204).json({
            status: process.env.SUCCESS_STATUS,
            data: null
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOne = Model => async (req, res, next) => {
    try {
        const id = req.params.id;
        const doc = await Model.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        
        if(!doc) {
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, `No document found with this id ${id}`), req, res, next);
        }

        res.status(200).json({
            status: process.env.SUCCESS_STATUS,
            data: {
                doc
            }
        });
    } catch (error) {
        next(error)
    }
};


exports.createOne = Model => async (req, res, next) => {
    try {
        const error = RuleValidator.validateRequest(req.body);
        const { rule, data } = req.body || {}
        const { field, condition, condition_value } = rule || {}
        const validation = {
            error: error.hasError ? error.hasError : false,
            field,
            field_value: Helper.getKeyValue(data, field),
            condition,
            condition_value
        }
        if(error.message && error.showData) {
            const data = {
                validation
            }
            return next(new AppError(process.env.HTTP_BAD_REQUEST_STATUS_CODE, process.env.ERROR_STATUS, error.message, data), req, res, next);
            //return res.status(process.env.HTTP_BAD_REQUEST_STATUS_CODE).json({ errors: errors })
        }else if(error.message) {
            return next(new AppError(process.env.HTTP_BAD_REQUEST_STATUS_CODE, process.env.ERROR_STATUS, error.message), req, res, next);
            //return res.status(process.env.HTTP_BAD_REQUEST_STATUS_CODE).json({ errors: errors })
        }else{
            return res.status(process.env.HTTP_OK_STATUS_CODE).json({
                message: `field ${field} successfully validated.`,
                status: process.env.SUCCESS_STATUS,
                data: {
                    validation: validation
                }
            });
        }
    } catch (error) {
        next(error)
    }
};

exports.getOne = Model => async (req, res, next) => {
    try {
        const id = req.params.id;
        const doc = await Model.findById(id);

        if(!doc) {
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, `No document found with this id ${id}`), req, res, next);
        }

        res.status(200).json({
            status: process.env.SUCCESS_STATUS,
            data: {
                doc
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAll = Model => async (req, res, next) => {
    try {
        const features = new APIFeatures(Model.find(), req.query)
            .sort()
            .paginate();
        
        const doc = await features.query;

        res.status(200).json({
            status: process.env.SUCCESS_STATUS,
            results: doc.length,
            data: {
                data: doc
            }
        });
    } catch (error) {
        next(error);
    }
};