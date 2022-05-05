const handleError = error => {
    console.log(error.message ? error.message : error);
    return {error};
}

module.exports = {
    handleError
}
