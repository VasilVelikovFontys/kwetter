import { combineReducers } from 'redux';
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import postReducer from "./postReducer";
import mentionsReducer from "./mentionsReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    mentions: mentionsReducer
});

export default rootReducer;
