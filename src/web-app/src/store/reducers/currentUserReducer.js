import {
    SET_CURRENT_USER,
    SET_CURRENT_USER_LOADING,
    SET_CURRENT_USER_ERROR
} from '../../constants';

const initState = {
    user: null,
    loading: false,
    error: null
}

const currentUserReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                user: action.user,
                loading: false,
                error: null
            }
        case SET_CURRENT_USER_LOADING:
            return {
                user: null,
                loading: true,
                error: null
            }
        case SET_CURRENT_USER_ERROR:
            return {
                user: null,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default currentUserReducer;
