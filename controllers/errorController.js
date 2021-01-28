// Express automatically knows that this entire function is an error handling middleware by specifying 4 parameters
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || process.env.HTTP_INTERNAL_SERVER_ERROR_STATUS_CODE;
    err.status = err.status || process.env.ERROR_STATUS

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}