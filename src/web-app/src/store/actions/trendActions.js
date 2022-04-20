import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {SET_TRENDS, SET_TRENDS_LOADING, SET_TRENDS_ERROR} from "../../constants";
import {envGet} from "../../utils/envHelper";

const SERVER_URL = `${envGet('SERVER_HOST')}:${envGet('SERVER_PORT')}`;

export const getTrends = () => {
    return async dispatch => {
        dispatch({type: SET_TRENDS_LOADING});

        const {data} = await axios.get(`${SERVER_URL}/trends`, {headers: getAuthHeader()});

        const {trends, error} = data
        if (error) return dispatch({type: SET_TRENDS_ERROR, error});

        dispatch({type: SET_TRENDS, trends});
    }
}
