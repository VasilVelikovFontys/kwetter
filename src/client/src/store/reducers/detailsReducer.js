import {SET_DETAILS_ERROR, SET_DETAILS_LOADING} from '../../constants';

const initState = {
    loading: false,
    error: null
}

const detailsReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_DETAILS_LOADING:
            return {
                loading: action.loading,
                error: null
            }
        case SET_DETAILS_ERROR:
            return {
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default detailsReducer;
