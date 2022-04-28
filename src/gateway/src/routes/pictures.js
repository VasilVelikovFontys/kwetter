const express = require("express");
const axios = require("axios");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const FormData = require("form-data");
const fs = require("fs");

const createPicturesRouter = (picturesUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken);

    router.post('/pictures', upload.single('file'), async (req, res) => {
        const {uid} = req.user;
        const file = req.file;

        const {mimetype} = file;
        const fileExtension = mimetype.substring(mimetype.indexOf('/') + 1);

        try {
            const formData = new FormData();
            formData.append("userId", uid);
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
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    router.get('/user-picture', async (req, res) => {
        const {uid} = req.user;

        try {
            const pictureResponse = await axios.get(`${picturesUrl}/pictures/user/${uid}`);
            const {picture} = pictureResponse.data;
            const pictureError = pictureResponse.data.error;

            if (pictureError) return res.status(202).send({error: pictureError});

            res.status(201).send({picture});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createPicturesRouter;
