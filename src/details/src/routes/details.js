const express = require("express");

const createDetailsRouter = (database, messaging) => {
    const router = express.Router();

    router.post('/details/:uid', async (req, res) => {
        const {uid} = req.params;
        const {firstName, lastName, location, website, bio} = req.body;

        if (!uid) return res.status(202).send({error: "User id is required!"});
        if (!firstName) return res.status(202).send({error: "First name is required!"});
        if (!lastName) return res.status(202).send({error: "Last name is required!"});
        if (!location) return res.status(202).send({error: "Location is required!"});
        if (!website) return res.status(202).send({error: "Website is required!"});
        if (!bio) return res.status(202).send({error: "Bio is required!"});
        if (bio.length > 160) return res.status(202).send({error: "A maximum of 160 characters is allowed for bio!"});

        try {
            const detailsResponse = await database.addDetails(uid, {firstName, lastName, location, website, bio})
            const {details} = detailsResponse;
            const detailsError = detailsResponse.error;

            if (detailsError) res.status(202).send({error: detailsError});

            const data = JSON.stringify({uid, details});
            messaging.publishDetailsAdded(data);

            res.status(201).send({details});
        } catch (error) {
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createDetailsRouter;
