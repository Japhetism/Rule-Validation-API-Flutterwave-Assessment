// Express automatically knows that this entire function is an error handling middleware by specifying 4 parameters
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || process.env.HTTP_INTERNAL_SERVER_ERROR_STATUS_CODE;
    err.status = err.status || process.env.ERROR_STATUS
    data = err.data || null

    res.status(err.statusCode).json({
        message: err.message,
        status: err.status,
        data,
        // error: err.errors.rule.message,
        // stack: err.stack
    })
}