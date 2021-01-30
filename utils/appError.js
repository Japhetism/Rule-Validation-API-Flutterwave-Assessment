class AppError extends Error {
    constructor(statusCode, status, message, data = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

module.exports = AppError;