const express = require("express");

const createAuthRouter = auth => {
    const router = express.Router();

    router.post('/auth/register', async (req, res) => {
        const {email, password} = req.body;

        if (!email) return res.status(202).send({error: "Email is required!"});
        if (!password) return res.status(202).send({error: "Password is required!"});

        try {
            const uid = await auth.registerUser(email, password);

            res.status(201).send({uid});
        } catch (error) {
            switch (error.code) {
                case "auth/email-already-in-use":
                    res.status(202).send({error: "Email already taken!"});
                    break;
                case "auth/weak-password":
                    res.status(202).send({error: "Password must be at least 6 characters!"});
                    break;
                case "auth/invalid-email":
                    res.status(202).send({error: "Invalid email!"});
                    break;
                default:
                    res.status(202).send({error});
                    break;
            }
        }
    });

    router.post('/auth/authenticate', async (req, res) => {
        const {email, password} = req.body;

        if (!email) return res.status(202).send({error: "Email is required!"});
        if (!password) return res.status(202).send({error: "Password is required!"});

        try {
            const uid = await auth.authenticateUser(email, password);

            res.status(200).send({uid});
        } catch (error) {
            switch (error.code) {
                case "auth/invalid-email":
                    res.status(202).send({error: "Invalid email!"});
                    break;
                case "auth/user-not-found":
                    res.status(202).send({error: "User not found!"});
                    break;
                case "auth/wrong-password":
                    res.status(202).send({error: "Wrong password!"});
                    break;
                default:
                    res.status(202).send({error});
                    break;
            }
        }
    });

    return router;
}

module.exports = createAuthRouter;
