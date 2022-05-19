import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_PICTURE_ERROR, SET_PICTURE_LOADING, SET_CURRENT_USER} from "../../constants";
import {getAuthHeader} from "../../utils/headers";
import {store} from "../../index";
import {handleRequestError} from "../../utils/requests";

const SERVER_URL = envGet('SERVER_URL');

export const updatePicture = file => {
    return async dispatch => {
        dispatch({type: SET_PICTURE_LOADING});

        const {user} = store.getState().currentUser;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const {data} = await axios.post(`${SERVER_URL}/pictures`, formData, {headers: getAuthHeader()});

            const {url} = data

            dispatch({type: SET_PICTURE_LOADING, loading: false});
            dispatch({type: SET_CURRENT_USER, user: {...user, picture: url}});

        } catch (error) {
            handleRequestError(error, dispatch, SET_PICTURE_ERROR);
        }
    }
};
