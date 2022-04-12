import {SET_AUTH, SET_AUTH_LOADING, SET_AUTH_ERROR} from '../../constants';

const initState = {
    jwt: null,
    loading: false,
    error: null
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_AUTH:
            return {
                jwt: action.jwt,
                loading: false,
                error: null
            }
        case SET_AUTH_LOADING:
            return {
                jwt: null,
                loading: true,
                error: null
            }
        case SET_AUTH_ERROR:
            return {
                jwt: null,
                loading: true,
                error: action.error
            }
        default:
            return state
    }
}

export default authReducer;
