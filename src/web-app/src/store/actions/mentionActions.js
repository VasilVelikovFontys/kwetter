import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {SET_MENTIONS, SET_MENTIONS_LOADING, SET_MENTIONS_ERROR} from "../../constants";
import {envGet} from "../../utils/envHelper";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const getMentions = () => {
    return async dispatch => {
        dispatch({type: SET_MENTIONS_LOADING});

        const {data} = await axios.get(`${SERVER_URL}/posts/mentioning`, {headers: getAuthHeader()});

        const {mentions, error} = data
        if (error) return dispatch({type: SET_MENTIONS_ERROR, error});

        dispatch({type: SET_MENTIONS, mentions});
    }
}
