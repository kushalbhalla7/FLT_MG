const response = (status, code, error = 'null', message = '', response = 'null',) => {
    if (error === '') {
        error = null;
    }

    const data = {
        status,
        code,
        error,
        msg: message,
        response,
    };

    return data;
};

module.exports = {
    response,
};
