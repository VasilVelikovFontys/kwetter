import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {getAuthHeader} from "../../utils/headers";
import {store} from "../../index";
import {
    SET_LIKE_ERROR,
    SET_LIKE_LOADING,
    SET_MENTIONS,
    SET_TIMELINE_POSTS
} from "../../constants";

const SERVER_URL = envGet('SERVER_URL');

export const likePost = postId => {
    return async dispatch => {
        dispatch({type: SET_LIKE_LOADING, postId, loading: true});

        const {user} = store.getState().user;
        const {mentions} = store.getState().mentions;
        const {posts: timelinePosts} = store.getState().timeline;

        try {
            await axios.post(`${SERVER_URL}/posts/${postId}/like`, {}, {headers: getAuthHeader()});

            const likedMention = mentions.find(mention => mention.id === postId);
            const likedTimelinePost = timelinePosts.find(post => post.id === postId);

            if (likedMention) {
                likedMention.likes.push(user.id);
                dispatch({type: SET_MENTIONS, mentions});
            }

            if (likedTimelinePost) {
                likedTimelinePost.likes.push(user.id);
                dispatch({type: SET_TIMELINE_POSTS, timelinePosts});
            }

            dispatch({type: SET_LIKE_LOADING, postId: null, loading: false});

        } catch (error) {
            const {response} = error;
            switch (response.status) {
                case 400:
                case 404:
                    return dispatch({type: SET_LIKE_ERROR, error: response.data, postId});

                case 500:
                    return dispatch({type: SET_LIKE_ERROR, error: "Server Error", postId});
            }
        }
    }
}
