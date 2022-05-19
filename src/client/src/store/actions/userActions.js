import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {
    SET_CURRENT_USER,
    SET_CURRENT_USER_LOADING,
    SET_CURRENT_USER_ERROR,
    SET_USER_LOADING,
    SET_USER,
    SET_USER_ERROR
} from "../../constants";
import {getAuthHeader} from "../../utils/headers";
import {handleRequestError} from "../../utils/requests";

const SERVER_URL = envGet('SERVER_URL');

export const getCurrentUser = () => {
    return async dispatch => {
        dispatch({type: SET_CURRENT_USER_LOADING});

        try {
            const {data} = await axios.get(`${SERVER_URL}/users/current`, {headers: getAuthHeader()});

            const {user} = data

            dispatch({type: SET_CURRENT_USER, user});
        } catch (error) {
            handleRequestError(error, dispatch, SET_CURRENT_USER_ERROR)
        }
    }
};

export const getUserByUsername = username => {
    return async dispatch => {
        dispatch({type: SET_USER_LOADING});

        try {
            const {data} = await axios.get(`${SERVER_URL}/users/${username}`, {headers: getAuthHeader()});

            const {user} = data

            dispatch({type: SET_USER, user});
        } catch (error) {
            handleRequestError(error, dispatch, SET_USER_ERROR)
        }
    }
}
