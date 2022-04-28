const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

const createPicturesRouter = (storage, messaging) => {
    const router = express.Router();

    router.get('/pictures/user/:uid', async (req, res) => {
        const {uid} = req.params;

        if (!uid) return res.status(202).send({error: 'User id is required!'});

        try {
            const picture = await storage.getUserPicture(uid);

            return res.status(200).send({picture});
        } catch (error) {
            return res.status(204).send({error});
        }
    });

    router.post('/pictures', upload.single('file'), async (req, res) => {
        const {userId} = req.body;
        const file = req.file;

        if (!userId) return res.status(202).send({error: 'User id is required!'});
        if (!file) return res.status(202).send({error: 'File is required!'});

        try {
            const uploadResponse = await storage.addUserPicture(userId, file);
            const {url, error} = uploadResponse;

            if (error) return res.status(204).send({error});

            fs.unlinkSync(file.path);
            const data = JSON.stringify({userId, url});
            messaging.publishPictureAdded(data);

            res.status(201).send({url});
        } catch (error) {
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createPicturesRouter;
