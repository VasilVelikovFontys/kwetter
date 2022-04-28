import { combineReducers } from 'redux';
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import postReducer from "./postReducer";
import mentionReducer from "./mentionReducer";
import followingReducer from "./followingReducer";
import followerReducer from "./followerReducer";
import timelineReducer from "./timelineReducer";
import likeReducer from "./likeReducer";
import trendReducer from "./trendReducer";
import trendPostReducer from "./trendPostReducer";
import pictureReducer from "./pictureReducer";
import detailsReducer from "./detailsReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    mentions: mentionReducer,
    following: followingReducer,
    followers: followerReducer,
    timeline: timelineReducer,
    likes: likeReducer,
    trends: trendReducer,
    trendPosts: trendPostReducer,
    picture: pictureReducer,
    details: detailsReducer
});

export default rootReducer;
