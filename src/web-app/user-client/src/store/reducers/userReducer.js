import {GET_USER, SET_USER_ERROR} from '../../constants';

const initState = {
    user: null,
    error: null
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_USER:
            return {
                user: action.data,
                error: null
            }
        case SET_USER_ERROR:
            return {
                user: null,
                error: action.data
            }
        default:
            return state
    }
}

export default userReducer;
