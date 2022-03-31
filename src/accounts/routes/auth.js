const express = require("express");
const {auth, authMiddleware, signOut} = require("../firebase/auth");

const router = express.Router();

router.use(authMiddleware);

router.post('/auth/register', async (req, res) => {
    const {email, password} = req.body;

    try {
        const authResponse = await auth.createUserWithEmailAndPassword(email, password);
        const uid = authResponse.user.uid;

        res.status(201).send({uid});
    } catch (error) {
        switch (error.code) {
            case "auth/email-already-in-use":
                res.status(202).send({error: "Email already taken!"});
                break;
            case "auth/weak-password":
                res.status(202).send({error: "Password must be at least 6 characters!"});
                break;
            default:
                res.status(202).send({error});
                break;
        }
    }
});

router.post('/auth/authenticate', async (req, res) => {
    const {email, password} = req.body;

    try {
        const authResponse = await auth.signInWithEmailAndPassword(email, password);
        const {uid} = authResponse.user;

        res.status(200).send({uid});
    } catch (error) {
        res.status(202).send({error});
    }
});

process.on('SIGINT', () => signOut());
process.on('SIGTERM', () => signOut());

module.exports = router;
