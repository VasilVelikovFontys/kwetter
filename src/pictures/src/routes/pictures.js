const express = require("express");
const multer = require("multer");
const fs = require("fs");

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 8000000
    }
});

const createPicturesRouter = (storage, messaging) => {
    const router = express.Router();

    router.post('/pictures', upload.single('file'), async (req, res) => {
        const {userId} = req.body;
        const file = req.file;

        if (!userId) return res.status(400).send({error: 'User id is required!'});
        if (!file) return res.status(400).send({error: 'File is required!'});

        if (!storage || !messaging) return res.sendStatus(500);

        const {url, error} = await storage.addUserPicture(userId, file);
        if (error) return res.status(500);

        fs.unlinkSync(file.path);
        const data = JSON.stringify({userId, url});
        messaging.publishPictureAdded(data);

        res.status(201).send({url});
    });

    return router;
}

module.exports = createPicturesRouter;
