const express = require("express");
const axios = require("axios");
const {getData, patchData, handleError} = require("../utils");

const createAccountsRouter = (accountsUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken);

    const checkAccess = async (allowedRoles, user) => {
        let hasAccess = false;

        allowedRoles.forEach(role => {
            if (user.roles.indexOf(role) > -1) return hasAccess = true;
        });

        if (!hasAccess) return {hasAccess: false};

        const {data} = await axios.get(`${accountsUrl}/accounts/${user.userId}`);
        const {account} = data;

        hasAccess = false;
        allowedRoles.forEach(role => {
            if (account.roles.indexOf(role) > -1) return hasAccess = true;
        });

        return {hasAccess};
    }

    router.get('/accounts', async (req, res) => {
        try {
            const {hasAccess} = await checkAccess(['ADMIN', 'MODERATOR'], req.user);
            if (!hasAccess) return res.sendStatus(403);

            await getData(res, `${accountsUrl}/accounts`);
        } catch (error) {
            handleError(res, error);
        }
    });

    router.patch('/accounts/:userId/promote', async (req, res) => {
        const {userId} = req.params;

        try {
            const {hasAccess} = await checkAccess(['ADMIN', 'MODERATOR'], req.user);
            if (!hasAccess) return res.sendStatus(403);

            await patchData(res, `${accountsUrl}/accounts/${userId}/promote`);
        } catch (error) {
            handleError(res, error);
        }
    });

    router.patch('/accounts/:userId/demote', async (req, res) => {
        const {userId} = req.params;

        try {
            const {hasAccess} = await checkAccess(['ADMIN'], req.user);
            if (!hasAccess) return res.sendStatus(403);

            await patchData(res, `${accountsUrl}/accounts/${userId}/demote`)
        } catch (error) {
            handleError(res, error);
        }
    });

    router.delete('/accounts/:userId', async (req, res) => {
        const {userId} = req.params;

        try {
            const {hasAccess} = await checkAccess(['ADMIN'], req.user);
            if (!hasAccess) return res.sendStatus(403);

            await axios.delete(`${accountsUrl}/accounts/${userId}`);
            await axios.delete(`${accountsUrl}/auth/${userId}`);

            res.sendStatus(200);
        } catch (error) {
            handleError(res, error);
        }
    });

    return router;
}

module.exports = createAccountsRouter;
