import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {SET_MENTIONS, SET_MENTIONS_ERROR} from "../../constants";
import {envGet} from "../../utils/envHelper";

const SERVER_HOST = envGet('SERVER_HOST');
const SERVER_PORT = envGet('SERVER_PORT');

export const getMentions = () => {
    return async dispatch => {
        const {data} = await axios.get(`${SERVER_HOST}:${SERVER_PORT}/posts/mentioning`, {headers: getAuthHeader()});

        const {posts, error} = data
        if (error) return dispatch({type: SET_MENTIONS_ERROR, error});

        dispatch({type: SET_MENTIONS, posts});
    }
}
