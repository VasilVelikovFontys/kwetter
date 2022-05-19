const handleError = error => {
    console.log(error.message ? error.message : error);
    return {error};
}

const handleLog = message => {
    console.log(message);
    return {};
}

module.exports = {
    handleError,
    handleLog
}
