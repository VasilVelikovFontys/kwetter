const express = require("express");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");
const {handleError} = require("../utils");

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 8000000
    }
});

const createPicturesRouter = (picturesUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken);

    router.post('/pictures', upload.single('file'), async (req, res) => {
        const {userId} = req.user;
        const file = req.file;

        if (!file || !file.mimetype) return res.sendStatus(400);

        const {mimetype} = file;
        const fileExtension = mimetype.substring(mimetype.indexOf('/') + 1);

        try {
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("file", fs.createReadStream(file.path), `file.${fileExtension}`);

            const pictureResponse = await axios.post(`${picturesUrl}/pictures`, formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });

            fs.unlinkSync(file.path);
            const {url} = pictureResponse.data;
            const pictureError = pictureResponse.data.error;

            if (pictureError) return res.status(202).send({error: pictureError});

            res.status(201).send({url});
        } catch (error) {
            handleError(res, error);
        }
    });

    return router;
}

module.exports = createPicturesRouter;
