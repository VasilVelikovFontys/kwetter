import {SET_USER, SET_USER_ERROR} from '../../constants';

const initState = {
    user: null,
    userError: null
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                user: action.user,
                authError: null
            }
        case SET_USER_ERROR:
            return {
                user: null,
                userError: action.error
            }
        default:
            return state
    }
}

export default userReducer;
