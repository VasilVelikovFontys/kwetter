import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {SET_FOLLOWERS, SET_FOLLOWERS_LOADING, SET_FOLLOWERS_ERROR} from "../../constants";
import {envGet} from "../../utils/envHelper";
import {handleRequestError} from "../../utils/requests";

const SERVER_URL = envGet('SERVER_URL');

export const getFollowers = () => {
    return async dispatch => {
        dispatch({type: SET_FOLLOWERS_LOADING});

        try {
            const {data} = await axios.get(`${SERVER_URL}/followers`, {headers: getAuthHeader()});

            const {followers} = data

            dispatch({type: SET_FOLLOWERS, followers});

        } catch (error) {
            handleRequestError(error, dispatch, SET_FOLLOWERS_ERROR);
        }
    }
}
