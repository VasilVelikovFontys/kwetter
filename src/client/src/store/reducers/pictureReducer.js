import {SET_PICTURE_LOADING, SET_PICTURE_ERROR} from '../../constants';

const initState = {
    loading: false,
    error: null
}

const pictureReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_PICTURE_LOADING:
            return {
                loading: action.loading,
                error: null
            }
        case SET_PICTURE_ERROR:
            return {
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default pictureReducer;
