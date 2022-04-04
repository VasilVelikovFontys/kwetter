import axios from 'axios';
import {envGet} from "../../utils/envHelper";
import {GET_USER} from "../../constants";

const SERVER_HOST = envGet('SERVER_HOST');
const SERVER_PORT = envGet('SERVER_PORT');

export const register = () => {
    return async dispatch => {
        const response = await axios.get(`${SERVER_HOST}:${SERVER_PORT}/auth/register`);

        dispatch({type: GET_USER, data: response.data});
    }
};

export const login = () => {
    return async dispatch => {
        const response = await axios.get(`${SERVER_HOST}:${SERVER_PORT}/auth/login`);

        dispatch({type: GET_USER, data: response.data});
    }
}
