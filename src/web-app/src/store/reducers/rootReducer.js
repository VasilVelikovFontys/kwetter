import { combineReducers } from 'redux';
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import postReducer from "./postReducer";
import mentionsReducer from "./mentionsReducer";
import followingReducer from "./followingReducer";
import followersReducer from "./followersReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    mentions: mentionsReducer,
    following: followingReducer,
    followers: followersReducer
});

export default rootReducer;
