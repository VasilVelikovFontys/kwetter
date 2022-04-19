import {SET_LIKE_LOADING, SET_LIKE_ERROR} from '../../constants';

const initState = {
    postId: null,
    loading: false,
    error: null
}

const likeReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_LIKE_LOADING:
            return {
                postId: action.postId,
                loading: action.loading,
                error: null
            }
        case SET_LIKE_ERROR:
            return {
                postId: action.postId,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default likeReducer;
