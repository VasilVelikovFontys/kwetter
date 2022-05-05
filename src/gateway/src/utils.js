const axios = require("axios");

const getData = async (res, url) => {
    try {
        const response = await axios.get(url);
        const data = response.data;

        res.status(200).send(data);
    } catch (error) {
        handleError(res, error);
    }
}

const postData = async (res, url, data) => {
    try {
        const response = await axios.post(url, data);
        const responseData = response.data;

        res.status(201).send(responseData);
    } catch (error) {
        handleError(res, error);
    }
}

const patchData = async (res, url, data) => {
    try {
        const response = await axios.patch(url, data);
        const responseData = response.data;

        res.status(201).send(responseData);
    } catch (error) {
        handleError(res, error);
    }
}

const deleteData = async (res, url) => {
    try {
        const response = await axios.delete(url);
        const responseData = response.data;

        res.status(200).send(responseData);
    } catch (error) {
        handleError(res, error);
    }
}

const handleError = (res, error) => {
    const {code, response} = error;
    if (code === "ECONNREFUSED") return res.sendStatus(503);

    if (!response) return console.log(error);

    const {status, data} = response;
    switch (status) {
        case 400:
        case 404:
            return res.status(status).send(data.error);

        case 500:
            return res.sendStatus(500);
    }
}

module.exports = {
    getData,
    postData,
    patchData,
    deleteData,
    handleError
}
