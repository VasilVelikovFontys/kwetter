import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_CURRENT_USER, SET_DETAILS_ERROR, SET_DETAILS_LOADING} from "../../constants";
import {getAuthHeader} from "../../utils/headers";
import {store} from "../../index";
import {handleRequestError} from "../../utils/requests";

const SERVER_URL = envGet('SERVER_URL');

export const setDetails = details => {
    return async dispatch => {
        dispatch({type: SET_DETAILS_LOADING, loading: true});

        const {user} = store.getState().currentUser;

        try {
            await axios.post(`${SERVER_URL}/users/details`, {...details}, {headers: getAuthHeader()});

            dispatch({type: SET_DETAILS_LOADING, loading: false});
            dispatch({type: SET_CURRENT_USER, user: {...user, ...details}});

        } catch (error) {
            handleRequestError(error, dispatch, SET_DETAILS_ERROR);
        }
    }
};
