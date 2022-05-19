import {
    SET_FOLLOW_ERROR,
    SET_FOLLOW_LOADING, SET_FOLLOWING,
} from "../../constants";
import axios from "axios";
import {getAuthHeader} from "../../utils/headers";
import {store} from "../../index";
import {envGet} from "../../utils/envHelper";

const SERVER_URL = envGet('SERVER_URL');

export const followUser = followedUsername => {
    return async dispatch => {
        dispatch({type: SET_FOLLOW_LOADING, followedUsername, loading: true});

        const {following} = store.getState().following;

        try {
            await axios.post(`${SERVER_URL}/follow/${followedUsername}`, {}, {headers: getAuthHeader()});

            const newFollowing = [...following, followedUsername]
            dispatch({type: SET_FOLLOWING, following: newFollowing});

            dispatch({type: SET_FOLLOW_LOADING, username: null, loading: false});

        } catch (error) {
            const {response} = error;
            switch (response.status) {
                case 400:
                case 404:
                    return dispatch({type: SET_FOLLOW_ERROR, error: response.data, username: followedUsername});

                case 500:
                    return dispatch({type: SET_FOLLOW_ERROR, error: "Server Error", username: followedUsername});
            }
        }
    }
}
