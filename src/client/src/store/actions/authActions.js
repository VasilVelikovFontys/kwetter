import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_AUTH, SET_AUTH_LOADING, SET_AUTH_ERROR, SET_USER} from "../../constants";
import {store} from "../../index";
import {handleRequestError} from "../../utils/requests";

const SERVER_URL = envGet('SERVER_URL');

export const getJwtFromLocalStorage = () => {
    return dispatch => {
        const jwt = localStorage.getItem('jwt');
        dispatch({type: SET_AUTH, jwt});
    }
}

export const verifyJwt = () => {
    return async dispatch => {
        const {jwt} = store.getState().auth;

        const {data} = await axios.post(`${SERVER_URL}/auth/token/verify`, {jwt});

        const {error} = data;

        if (error) {
            localStorage.removeItem('jwt');
            dispatch({type: SET_AUTH, jwt: null});
        } else {
            dispatch({type: SET_AUTH, jwt});
        }
    }
}

export const login = details => {
    return async dispatch => {
        dispatch({type: SET_AUTH_LOADING});

        try {
            const {data} = await axios.post(`${SERVER_URL}/auth/login`, {...details});

            const {jwt} = data

            localStorage.setItem('jwt', jwt);
            dispatch({type: SET_AUTH, jwt});

        } catch (error) {
            handleRequestError(error, dispatch, SET_AUTH_ERROR);
        }
    }
}

export const register = details => {
    return async dispatch => {
        dispatch({type: SET_AUTH_LOADING});

        try {
            const {data} = await axios.post(`${SERVER_URL}/auth/register`, {...details});
            dispatch({type: SET_USER, user: {...details, roles: ["USER"]}});

            const {jwt} = data

            localStorage.setItem('jwt', jwt);
            dispatch({type: SET_AUTH, jwt});

        } catch (error) {
            handleRequestError(error, dispatch, SET_AUTH_ERROR);
        }
    }
};

export const logOut = () => {
    return dispatch => {
        localStorage.removeItem('jwt');
        dispatch({type: SET_AUTH, jwt: null});
    }
}
