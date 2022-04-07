import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_USER, SET_USER_ERROR} from "../../constants";
import {getAuthHeader} from "../../utils/headers";

const SERVER_HOST = envGet('SERVER_HOST');
const SERVER_PORT = envGet('SERVER_PORT');

export const getCurrentUser = () => {
    return async dispatch => {
        const {data} = await axios.get(`${SERVER_HOST}:${SERVER_PORT}/users/current-user`, {headers: getAuthHeader()});

        const {user, error} = data
        if (error) return dispatch({type: SET_USER_ERROR, error});

        dispatch({type: SET_USER, user});
    }
};
