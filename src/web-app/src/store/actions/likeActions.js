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

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const likePost = postId => {
    return async dispatch => {
        dispatch({type: SET_LIKE_LOADING, postId, loading: true});

        const {user} = store.getState().user;
        const {mentions} = store.getState().mentions;
        const {posts: timelinePosts} = store.getState().timeline;

        const {data} = await axios.post(`${SERVER_URL}/posts/${postId}/like`, {}, {headers: getAuthHeader()});

        const {error} = data
        if (error) return dispatch({type: SET_LIKE_ERROR, postId: postId, error});

        const likedMention = mentions.find(mention => mention.id === postId)
        const likedTimelinePost = timelinePosts.find(post => post.id === postId)

        if (likedMention) {
            likedMention.likes.push(user.id);
            dispatch({type: SET_MENTIONS, mentions});
        }

        if (likedTimelinePost) {
            likedTimelinePost.likes.push(user.id);
            dispatch({type: SET_TIMELINE_POSTS, timelinePosts});
        }

        dispatch({type: SET_LIKE_LOADING, postId: null, loading: false})
    }
}
