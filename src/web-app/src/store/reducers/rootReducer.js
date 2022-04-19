import { combineReducers } from 'redux';
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import postReducer from "./postReducer";
import mentionReducer from "./mentionReducer";
import followingReducer from "./followingReducer";
import followersReducer from "./followersReducer";
import timelineReducer from "./timelineReducer";
import likeReducer from "./likeReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    mentions: mentionReducer,
    following: followingReducer,
    followers: followersReducer,
    timeline: timelineReducer,
    likes: likeReducer
});

export default rootReducer;
