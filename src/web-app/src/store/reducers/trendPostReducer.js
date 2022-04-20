import {SET_TREND_POSTS, SET_TREND_POSTS_ERROR, SET_TREND_POSTS_LOADING} from '../../constants';

const initState = {
    posts: [],
    loading: false,
    error: null
}

const trendPostReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_TREND_POSTS:
            return {
                posts: action.posts,
                loading: false,
                error: null
            }
        case SET_TREND_POSTS_LOADING:
            return {
                posts: [],
                loading: true,
                error: null
            }
        case SET_TREND_POSTS_ERROR:
            return {
                posts: null,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default trendPostReducer;
