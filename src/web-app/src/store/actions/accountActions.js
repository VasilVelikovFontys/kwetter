import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {MODERATOR_ROLE, SET_ACCOUNTS, SET_ACCOUNTS_ERROR, SET_ACCOUNTS_LOADING} from "../../constants";
import {getAuthHeader} from "../../utils/headers";
import {handleRequestError} from "../../utils/requests";
import {store} from "../../index";

const SERVER_URL = envGet('SERVER_URL');

export const getAccounts = () => {
    return async dispatch => {
        dispatch({type: SET_ACCOUNTS_LOADING});

        try {
            const {data} = await axios.get(`${SERVER_URL}/accounts`, {headers: getAuthHeader()});

            const accounts = data

            dispatch({type: SET_ACCOUNTS, accounts});

        } catch (error) {
            handleRequestError(error, dispatch, SET_ACCOUNTS_ERROR);
        }
    }
}

export const promoteAccount = id => {
    return async dispatch => {
        const {accounts} = store.getState().accounts;
        const newAccounts = [...accounts];

        dispatch({type: SET_ACCOUNTS_LOADING});

        try {
            await axios.patch(`${SERVER_URL}/accounts/${id}/promote`, {}, {headers: getAuthHeader()});

            const updatedAccount = newAccounts.find(account => account.id === id);
            updatedAccount.roles.push(MODERATOR_ROLE);

            dispatch({type: SET_ACCOUNTS, accounts: newAccounts});

        } catch (error) {
            handleRequestError(error, dispatch, SET_ACCOUNTS_ERROR);
        }
    }
}

export const demoteAccount = id => {
    return async dispatch => {
        const {accounts} = store.getState().accounts;
        const newAccounts = [...accounts];

        dispatch({type: SET_ACCOUNTS_LOADING});

        try {
            await axios.patch(`${SERVER_URL}/accounts/${id}/demote`, {}, {headers: getAuthHeader()});

            const updatedAccount = newAccounts.find(account => account.id === id);
            updatedAccount.roles = updatedAccount.roles.filter(role => role !== MODERATOR_ROLE);

            dispatch({type: SET_ACCOUNTS, accounts: newAccounts});

        } catch (error) {
            handleRequestError(error, dispatch, SET_ACCOUNTS_ERROR);
        }
    }
}

export const deleteAccount = id => {
    return async dispatch => {
        const {accounts} = store.getState().accounts;
        let newAccounts = [...accounts];

        dispatch({type: SET_ACCOUNTS_LOADING});

        try {
            await axios.delete(`${SERVER_URL}/accounts/${id}`, {headers: getAuthHeader()});

            newAccounts = newAccounts.filter(account => account.id !== id);

            dispatch({type: SET_ACCOUNTS, accounts: newAccounts});

        } catch (error) {
            handleRequestError(error, dispatch, SET_ACCOUNTS_ERROR);
        }
    }
}
