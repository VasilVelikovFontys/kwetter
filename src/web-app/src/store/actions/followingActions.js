import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_FOLLOWING, SET_FOLLOWING_LOADING, SET_FOLLOWING_ERROR} from "../../constants";
import {getAuthHeader} from "../../utils/headers";
import {store} from "../../index";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const follow = followedUsername => {
    return async dispatch => {
        dispatch({type: SET_FOLLOWING_LOADING});

        const {data} = await axios.post(`${SERVER_URL}/follow/${followedUsername}`, {}, {headers: getAuthHeader()});

        const {follow, error} = data
        if (error) return dispatch({type: SET_FOLLOWING_ERROR, error});

        const {following} = store.getState().following

        following.push(follow.followedUsername);

        dispatch({type: SET_FOLLOWING, following});
    }
}

export const getFollowing = () => {
    return async dispatch => {
        dispatch({type: SET_FOLLOWING_LOADING});

        const {data} = await axios.get(`${SERVER_URL}/following`, {headers: getAuthHeader()});

        const {following, error} = data
        if (error) return dispatch({type: SET_FOLLOWING_ERROR, error});

        dispatch({type: SET_FOLLOWING, following});
    }
}
