const ApiError = require("../utils/ApiError")

// Async handler wrapper to catch errors in async functions
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const ErrorHandling = async(err, req, res, next) => {
    
    const obj = {}
    
    if (err instanceof ApiError) {
        obj['statusCode'] = err.statusCode
        obj['message'] = err.message
        obj['stack'] = err.stack
    }
    else {
        obj['statusCode'] = 400
        obj['message'] = err.message
        obj['stack'] = err.stack
    }

    res.status(obj.statusCode).json(obj)

}

module.exports = { ErrorHandling, asyncHandler }