import {envGet} from "../../utils/envHelper";
import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {SET_USER_POSTS_ERROR, SET_USER_POSTS} from "../../constants";
import {store} from "../../index";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const createPost = text => {
    return async dispatch => {
        const {data} = await axios.post(`${SERVER_URL}/posts`, {text}, {headers: getAuthHeader()});

        const {post, error} = data
        if (error) return dispatch({type: SET_USER_POSTS_ERROR, error});

        const {posts} = store.getState().posts;

        let newPosts = posts;
        if (newPosts.length === 10) {
            newPosts = newPosts.pop();
        }
        newPosts.unshift(post);

        dispatch({type: SET_USER_POSTS, posts: newPosts});
    }
}

export const getUserPosts = () => {
    return async dispatch => {
        const {data} = await axios.get(`${SERVER_URL}/posts`, {headers: getAuthHeader()});

        const {posts, error} = data
        if (error) return dispatch({type: SET_USER_POSTS_ERROR, error});

        dispatch({type: SET_USER_POSTS, posts});
    }
}
