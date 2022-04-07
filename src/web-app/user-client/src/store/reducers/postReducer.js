import {SET_USER_POSTS, SET_USER_POSTS_ERROR} from '../../constants';

const initState = {
    posts: [],
    postsError: null
}

const postReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_USER_POSTS:
            return {
                posts: action.posts,
                postsError: null
            }
        case SET_USER_POSTS_ERROR:
            return {
                posts: null,
                postsError: action.error
            }
        default:
            return state
    }
}

export default postReducer;
