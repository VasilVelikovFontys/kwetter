import {SET_MENTIONS, SET_MENTIONS_ERROR, SET_MENTIONS_LOADING} from '../../constants';

const initState = {
    mentions: [],
    loading: false,
    error: null
}

const mentionReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_MENTIONS:
            return {
                mentions: action.mentions,
                loading: false,
                error: null
            }
        case SET_MENTIONS_LOADING:
            return {
                mentions: [],
                loading: true,
                error: null
            }
        case SET_MENTIONS_ERROR:
            return {
                mentions: null,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default mentionReducer;
