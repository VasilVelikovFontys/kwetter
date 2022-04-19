import {envGet} from "../../utils/envHelper";
import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {
    SET_USER_POSTS_ERROR,
    SET_USER_POSTS_LOADING,
    SET_USER_POSTS,
    SET_TIMELINE_POSTS,
    SET_TIMELINE_POSTS_LOADING
} from "../../constants";
import {store} from "../../index";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const createPost = text => {
    return async dispatch => {
        const {posts: userPosts} = store.getState().posts;
        const {posts: timelinePosts} = store.getState().timeline;

        dispatch({type: SET_USER_POSTS_LOADING});
        dispatch({type: SET_TIMELINE_POSTS_LOADING});

        const {data} = await axios.post(`${SERVER_URL}/posts`, {text}, {headers: getAuthHeader()});

        const {post, error} = data
        if (error) return dispatch({type: SET_USER_POSTS_ERROR, error});

        let newUserPosts = userPosts;
        if (newUserPosts.length === 10) {
            newUserPosts = newUserPosts.pop();
        }
        newUserPosts.unshift(post);

        let newTimelinePosts = timelinePosts;
        timelinePosts.unshift(post);

        dispatch({type: SET_USER_POSTS, posts: newUserPosts});
        dispatch({type: SET_TIMELINE_POSTS, posts: newTimelinePosts});
    }
}

export const getUserPosts = () => {
    return async dispatch => {
        dispatch({type: SET_USER_POSTS_LOADING});

        const {data} = await axios.get(`${SERVER_URL}/posts`, {headers: getAuthHeader()});

        const {posts, error} = data
        if (error) return dispatch({type: SET_USER_POSTS_ERROR, error});

        dispatch({type: SET_USER_POSTS, posts});
    }
}
