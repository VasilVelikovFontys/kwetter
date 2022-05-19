import {SET_TRENDS, SET_TRENDS_ERROR, SET_TRENDS_LOADING} from '../../constants';

const initState = {
    trends: [],
    loading: false,
    error: null
}

const trendReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_TRENDS:
            return {
                trends: action.trends,
                loading: false,
                error: null
            }
        case SET_TRENDS_LOADING:
            return {
                trends: [],
                loading: true,
                error: null
            }
        case SET_TRENDS_ERROR:
            return {
                trends: null,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default trendReducer;
