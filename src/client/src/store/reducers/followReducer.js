import {SET_FOLLOW_LOADING, SET_FOLLOW_ERROR} from '../../constants';

const initState = {
    username: null,
    loading: false,
    error: null
}

const followReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_FOLLOW_LOADING:
            return {
                username: action.username,
                loading: action.loading,
                error: null
            }
        case SET_FOLLOW_ERROR:
            return {
                username: action.username,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default followReducer;
