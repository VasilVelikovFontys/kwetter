import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {SET_FOLLOWERS, SET_FOLLOWERS_LOADING, SET_FOLLOWERS_ERROR} from "../../constants";
import {envGet} from "../../utils/envHelper";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const getFollowers = () => {
    return async dispatch => {
        dispatch({type: SET_FOLLOWERS_LOADING});

        const {data} = await axios.get(`${SERVER_URL}/followers`, {headers: getAuthHeader()});

        const {followers, error} = data
        if (error) return dispatch({type: SET_FOLLOWERS_ERROR, error});

        dispatch({type: SET_FOLLOWERS, followers});
    }
}
