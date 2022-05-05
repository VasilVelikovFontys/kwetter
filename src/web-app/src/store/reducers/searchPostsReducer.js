import {
    SET_SEARCH_POSTS,
    SET_SEARCH_POSTS_LOADING,
    SET_SEARCH_POSTS_ERROR
} from '../../constants';

const initState = {
    posts: [],
    loading: false,
    error: null
}

const searchPostReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_SEARCH_POSTS:
            return {
                posts: action.posts,
                loading: false,
                error: null
            }
        case SET_SEARCH_POSTS_LOADING:
            return {
                posts: [],
                loading: true,
                error: null
            }
        case SET_SEARCH_POSTS_ERROR:
            return {
                posts: null,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default searchPostReducer;
