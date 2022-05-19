import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {SET_FOLLOWING, SET_FOLLOWING_LOADING, SET_FOLLOWING_ERROR} from "../../constants";
import {getAuthHeader} from "../../utils/headers";
import {handleRequestError} from "../../utils/requests";

const SERVER_URL = envGet('SERVER_URL');

export const getFollowing = () => {
    return async dispatch => {
        dispatch({type: SET_FOLLOWING_LOADING});

        try {
            const {data} = await axios.get(`${SERVER_URL}/following`, {headers: getAuthHeader()});

            const {following} = data

            dispatch({type: SET_FOLLOWING, following});

        } catch (error) {
            handleRequestError(error, dispatch, SET_FOLLOWING_ERROR)
        }

    }
}
