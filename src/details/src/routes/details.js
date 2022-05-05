const express = require("express");

const createDetailsRouter = (database, messaging) => {
    const router = express.Router();

    router.post('/details', async (req, res) => {
        const {userId, firstName, lastName, location, website, bio} = req.body;

        if (!userId) return res.status(400).send({error: "User id is required!"});
        if (!firstName) return res.status(400).send({error: "First name is required!"});
        if (!lastName) return res.status(400).send({error: "Last name is required!"});
        if (!location) return res.status(400).send({error: "Location is required!"});
        if (!website) return res.status(400).send({error: "Website is required!"});
        if (!bio) return res.status(400).send({error: "Bio is required!"});
        if (bio.length > 160) return res.status(400).send({error: "A maximum of 160 characters is allowed for bio!"});

        if (!database || !messaging) return res.sendStatus(500);

        const {details, error} = await database.addDetails(userId, {firstName, lastName, location, website, bio})
        if (error) res.sendStatus(500);

        const data = JSON.stringify({userId, details});
        messaging.publishDetailsAdded(data);

        res.status(201).send({details});
    });

    return router;
}

module.exports = createDetailsRouter;
