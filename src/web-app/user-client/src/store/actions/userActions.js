import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_USER, SET_USER_ERROR} from "../../constants";
import {getAuthHeader} from "../../utils/headers";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const getCurrentUser = () => {
    return async dispatch => {
        const {data} = await axios.get(`${SERVER_URL}/users/current-user`, {headers: getAuthHeader()});

        const {user, error} = data
        if (error) return dispatch({type: SET_USER_ERROR, error});

        dispatch({type: SET_USER, user});
    }
};
