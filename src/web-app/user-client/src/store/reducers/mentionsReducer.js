import {SET_MENTIONS, SET_MENTIONS_ERROR} from '../../constants';

const initState = {
    posts: [],
    postsError: null
}

const mentionsReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_MENTIONS:
            return {
                posts: action.posts,
                postsError: null
            }
        case SET_MENTIONS_ERROR:
            return {
                posts: null,
                postsError: action.error
            }
        default:
            return state
    }
}

export default mentionsReducer;
