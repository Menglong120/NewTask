const catchErrorResponse = (err) => ({
    result: false,
    msg: err?.sqlMessage || err?.message || "Something went wrong",
    error: err,
    data: []
});

const successResponse = (status = 200 ,msg, data = [], cookie = null) => ({
    status: status,
    body: {
        result: true,
        msg: msg,
        data: data
    },
    ...(cookie && { cookie })
});

const errorResponse = (status = 400 ,msg, error = null, data = []) => ({
    status: status,
    body: {
        result: false,
        msg: msg,
        error: error,
        data: data
    }
});

module.exports = { 
    catchErrorResponse,
    successResponse, 
    errorResponse
};
