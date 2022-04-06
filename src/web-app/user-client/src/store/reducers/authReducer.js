import {SET_AUTH_TOKEN, SET_AUTH_ERROR} from '../../constants';

const initState = {
    jwt: null,
    authError: null
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_AUTH_TOKEN:
            return {
                jwt: action.jwt,
                authError: null
            }
        case SET_AUTH_ERROR:
            return {
                jwt: null,
                authError: action.error
            }
        default:
            return state
    }
}

export default authReducer;
