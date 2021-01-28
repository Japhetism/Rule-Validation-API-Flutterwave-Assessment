const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Author = require('../fixtures/author_info');


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
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, `No document found with this id ${id}`), rq, res, next);
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
        const doc = await Model.create(req.body);

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