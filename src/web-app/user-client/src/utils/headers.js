import {store} from "../index";

export const getAuthHeader = () => {
    const {jwt} = store.getState().auth;
    return {'authorization': jwt};
}
