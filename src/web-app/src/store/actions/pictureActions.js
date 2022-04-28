import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_PICTURE_ERROR, SET_PICTURE_LOADING, SET_USER} from "../../constants";
import {getAuthHeader} from "../../utils/headers";
import {store} from "../../index";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const updatePicture = file => {
    return async dispatch => {
        dispatch({type: SET_PICTURE_LOADING});

        const {user} = store.getState().user;

        const formData = new FormData();
        formData.append("file", file);

        const {data} = await axios.post(`${SERVER_URL}/pictures`, formData, {headers: getAuthHeader()});

        const {url, error} = data
        if (error) return dispatch({type: SET_PICTURE_ERROR, error});

        dispatch({type: SET_PICTURE_LOADING, loading: false});
        dispatch({type: SET_USER, user: {...user, picture: url}});
    }
};
