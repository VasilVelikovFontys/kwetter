import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {SET_TIMELINE_POSTS, SET_TIMELINE_POSTS_LOADING, SET_TIMELINE_POSTS_ERROR} from '../../constants';
import {envGet} from "../../utils/envHelper";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const getTimelinePosts = () => {
    return async dispatch => {
        dispatch({type: SET_TIMELINE_POSTS_LOADING});

        const {data} = await axios.get(`${SERVER_URL}/posts/timeline`, {headers: getAuthHeader()});

        const {posts, error} = data
        if (error) return dispatch({type: SET_TIMELINE_POSTS_ERROR, error});

        dispatch({type: SET_TIMELINE_POSTS, posts});
    }
}
