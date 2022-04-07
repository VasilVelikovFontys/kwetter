import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_AUTH_TOKEN, SET_AUTH_ERROR} from "../../constants";
import {store} from "../../index";

const SERVER_HOST = envGet('SERVER_HOST');
const SERVER_PORT = envGet('SERVER_PORT');

export const getJwtFromLocalStorage = () => {
    return dispatch => {
        const jwt = localStorage.getItem('jwt');
        dispatch({type: SET_AUTH_TOKEN, jwt});
    }
}

export const verifyJwt = () => {
    return async dispatch => {
        const {jwt} = store.getState().auth;
        const {data} = await axios.post(`${SERVER_HOST}:${SERVER_PORT}/auth/verify-token`, {jwt});

        const {error} = data;

        if (error) {
            localStorage.removeItem('jwt');
            dispatch({type: SET_AUTH_TOKEN, jwt: null});
        } else {
            dispatch({type: SET_AUTH_TOKEN, jwt});
        }
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const {data} = await axios.post(`${SERVER_HOST}:${SERVER_PORT}/auth/login`, {email, password});

        const {jwt, error} = data
        if (error) return dispatch({type: SET_AUTH_ERROR, error});

        localStorage.setItem('jwt', jwt);
        dispatch({type: SET_AUTH_TOKEN, jwt});
    }
}

export const register = (username, email, password) => {
    return async dispatch => {
        const {data} = await axios.post(`${SERVER_HOST}:${SERVER_PORT}/auth/register`, {username, email, password});

        const {jwt, error} = data
        if (error) return dispatch({type: SET_AUTH_ERROR, error});

        localStorage.setItem('jwt', jwt);
        dispatch({type: SET_AUTH_TOKEN, jwt});
    }
};

export const logOut = () => {
    return dispatch => {
        localStorage.removeItem('jwt');
        dispatch({type: SET_AUTH_TOKEN, jwt: null});
    }
}
