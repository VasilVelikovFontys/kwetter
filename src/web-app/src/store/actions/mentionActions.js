import {SET_MENTIONS, SET_MENTIONS_LOADING, SET_MENTIONS_ERROR} from "../../constants";
import {envGet} from "../../utils/envHelper";
import {handleRequestError} from "../../utils/requests";
import axios from "axios";
import {getAuthHeader} from "../../utils/headers";

const SERVER_URL = envGet('SERVER_URL');

export const getMentions = () => {
    return async dispatch => {
        dispatch({type: SET_MENTIONS_LOADING});

        try {
            const {data} = await axios.get(`${SERVER_URL}/posts/mentioning`, {headers: getAuthHeader()});

            const {posts} = data

            dispatch({type: SET_MENTIONS, mentions: posts});
        } catch (error) {
            handleRequestError(error, dispatch, SET_MENTIONS_ERROR)
        }
    }
}
