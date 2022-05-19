import {SET_TIMELINE_POSTS, SET_TIMELINE_POSTS_LOADING, SET_TIMELINE_POSTS_ERROR,} from '../../constants';
import {envGet} from "../../utils/envHelper";
import {handleRequestError} from "../../utils/requests";
import axios from "axios";
import {getAuthHeader} from "../../utils/headers";

const SERVER_URL = envGet('SERVER_URL');

export const getTimelinePosts = () => {
    return async dispatch => {
        dispatch({type: SET_TIMELINE_POSTS_LOADING});

        try {
            const {data} = await axios.get(`${SERVER_URL}/posts/timeline`, {headers: getAuthHeader()});

            const {posts} = data

            dispatch({type: SET_TIMELINE_POSTS, posts});
        } catch (error) {
            handleRequestError(error, dispatch, SET_TIMELINE_POSTS_ERROR);
        }
    }
}
