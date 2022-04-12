import {SET_FOLLOWERS, SET_FOLLOWERS_ERROR, SET_FOLLOWERS_LOADING} from '../../constants';

const initState = {
    followers: [],
    loading: false,
    error: null
}

const followersReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_FOLLOWERS:
            return {
                followers: action.followers,
                loading: false,
                error: null
            }
        case SET_FOLLOWERS_LOADING:
            return {
                followers: [],
                loading: true,
                error: null
            }
        case SET_FOLLOWERS_ERROR:
            return {
                followers: null,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default followersReducer;
