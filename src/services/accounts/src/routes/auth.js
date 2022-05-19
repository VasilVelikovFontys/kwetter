const express = require("express");

const createAuthRouter = (auth, admin) => {
    const router = express.Router();

    router.post('/auth/register', async (req, res) => {
        const {email, password} = req.body;

        if (!email) return res.status(400).send({error: "Email is required!"});
        if (!password) return res.status(400).send({error: "Password is required!"});

        if (!auth) return res.sendStatus(500);

        const {userId, error} = await auth.registerUser(email, password);

        if (error) {
            switch (error.code) {
                case "auth/email-already-in-use":
                    return res.status(400).send({error: "Email already taken!"});

                case "auth/weak-password":
                    return res.status(400).send({error: "Password must be at least 6 characters!"});

                case "auth/invalid-email":
                    return res.status(400).send({error: "Invalid email!"});

                default:
                    return res.status(400).send({error});
            }
        }

        res.status(201).send({userId});
    });

    router.post('/auth/authenticate', async (req, res) => {
        const {email, password} = req.body;

        if (!email) return res.status(400).send({error: "Email is required!"});
        if (!password) return res.status(400).send({error: "Password is required!"});

        if (!auth) return res.sendStatus(500);

        const {userId, error} = await auth.authenticateUser(email, password);

        if (error) {
            switch (error.code) {
                case "auth/invalid-email":
                    return res.status(400).send({error: "Invalid email!"});

                case "auth/user-not-found":
                    return res.status(404).send({error: "User not found!"});

                case "auth/wrong-password":
                    return res.status(400).send({error: "Wrong password!"});

                default:
                    return res.status(400).send({error});
            }
        }

        res.status(200).send({userId});
    });

    router.delete('/auth/:userId', async (req, res) => {
        const {userId} = req.params;

        if (!admin) return res.sendStatus(500);

        const {error} = await admin.deleteAccount(userId);
        if (error) return res.sendStatus(500);

        res.sendStatus(200);
    });

    return router;
}

module.exports = createAuthRouter;
