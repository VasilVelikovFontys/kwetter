import {
    SET_USER_LOADING, SET_USER_ERROR, SET_USER
} from '../../constants';

const initState = {
    user: null,
    loading: false,
    error: null
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                user: action.user,
                loading: false,
                error: null
            }
        case SET_USER_LOADING:
            return {
                user: null,
                loading: true,
                error: null
            }
        case SET_USER_ERROR:
            return {
                user: null,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default userReducer;
