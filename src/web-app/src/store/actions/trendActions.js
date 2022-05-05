import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {SET_TRENDS, SET_TRENDS_LOADING, SET_TRENDS_ERROR} from "../../constants";
import {envGet} from "../../utils/envHelper";
import {handleRequestError} from "../../utils/requests";

const SERVER_URL = envGet('SERVER_URL');

export const getTrends = () => {
    return async dispatch => {
        dispatch({type: SET_TRENDS_LOADING});

        try {
            const {data} = await axios.get(`${SERVER_URL}/trends`, {headers: getAuthHeader()});

            const {trends} = data

            dispatch({type: SET_TRENDS, trends});
        } catch (error) {
            handleRequestError(error, dispatch, SET_TRENDS_ERROR)
        }
    }
}
