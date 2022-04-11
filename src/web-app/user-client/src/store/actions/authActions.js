import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_AUTH_TOKEN, SET_AUTH_ERROR} from "../../constants";
import {store} from "../../index";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const getJwtFromLocalStorage = () => {
    return dispatch => {
        const jwt = localStorage.getItem('jwt');
        dispatch({type: SET_AUTH_TOKEN, jwt});
    }
}

export const verifyJwt = () => {
    return async dispatch => {
        const {jwt} = store.getState().auth;
        const {data} = await axios.post(`${SERVER_URL}/auth/verify-token`, {jwt});

        const {error} = data;

        if (error) {
            localStorage.removeItem('jwt');
            dispatch({type: SET_AUTH_TOKEN, jwt: null});
        } else {
            dispatch({type: SET_AUTH_TOKEN, jwt});
        }
    }
}

export const login = details => {
    return async dispatch => {
        const {data} = await axios.post(`${SERVER_URL}/auth/login`, {...details});

        const {jwt, error} = data
        if (error) return dispatch({type: SET_AUTH_ERROR, error});

        localStorage.setItem('jwt', jwt);
        dispatch({type: SET_AUTH_TOKEN, jwt});
    }
}

export const register = details => {
    return async dispatch => {
        const {data} = await axios.post(`${SERVER_URL}/auth/register`, {...details});

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
