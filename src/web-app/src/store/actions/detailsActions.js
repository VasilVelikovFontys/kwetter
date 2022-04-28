import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_DETAILS_ERROR, SET_DETAILS_LOADING, SET_USER} from "../../constants";
import {getAuthHeader} from "../../utils/headers";
import {store} from "../../index";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const setDetails = details => {
    return async dispatch => {
        dispatch({type: SET_DETAILS_LOADING, loading: true});

        const {user} = store.getState().user;

        const {data} = await axios.post(`${SERVER_URL}/details`, {...details}, {headers: getAuthHeader()});

        const {error} = data
        if (error) return dispatch({type: SET_DETAILS_ERROR, error});

        dispatch({type: SET_DETAILS_LOADING, loading: false});
        dispatch({type: SET_USER, user: {...user, ...details}});
    }
};
