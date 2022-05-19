import {SET_FOLLOWING, SET_FOLLOWING_ERROR, SET_FOLLOWING_LOADING} from '../../constants';

const initState = {
    following: [],
    loading: false,
    error: null
}

const followingReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_FOLLOWING:
            return {
                following: action.following,
                loading: false,
                error: null
            }
        case SET_FOLLOWING_LOADING:
            return {
                following: [],
                loading: true,
                error: null
            }
        case SET_FOLLOWING_ERROR:
            return {
                following: null,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default followingReducer;
