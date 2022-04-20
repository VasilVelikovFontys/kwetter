import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {envGet} from "../../utils/envHelper";
import {SET_TREND_POSTS, SET_TREND_POSTS_LOADING, SET_TREND_POSTS_ERROR} from "../../constants";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const getPostsByTrend = trendId => {
    return async dispatch => {
        dispatch({type: SET_TREND_POSTS_LOADING});

        const {data} = await axios.get(`${SERVER_URL}/posts/trend/${trendId}`, {headers: getAuthHeader()});

        const {posts, error} = data
        if (error) return dispatch({type: SET_TREND_POSTS_ERROR, error});

        dispatch({type: SET_TREND_POSTS, posts});
    }
}
