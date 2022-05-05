import {envGet} from "../../utils/envHelper";
import {SET_TREND_POSTS, SET_TREND_POSTS_LOADING, SET_TREND_POSTS_ERROR} from "../../constants";
import {handleRequestError} from "../../utils/requests";
import axios from "axios";
import {getAuthHeader} from "../../utils/headers";

const SERVER_URL = envGet('SERVER_URL');

export const getPostsByTrend = trendId => {
    return async dispatch => {
        dispatch({type: SET_TREND_POSTS_LOADING});

        try {
            const {data} = await axios.get(`${SERVER_URL}/posts/trend/${trendId}`, {headers: getAuthHeader()});

            const {posts} = data

            dispatch({type: SET_TREND_POSTS, posts});
        } catch (error) {
            handleRequestError(error, dispatch, SET_TREND_POSTS_ERROR);
        }
    }
}
