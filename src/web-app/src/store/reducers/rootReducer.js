import { combineReducers } from 'redux';
import authReducer from "./authReducer";
import currentUserReducer from "./currentUserReducer";
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
import userReducer from "./userReducer";
import followReducer from "./followReducer";
import searchPostReducer from "./searchPostsReducer";
import accountReducer from "./accountReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    currentUser: currentUserReducer,
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
    details: detailsReducer,
    follow: followReducer,
    searchPosts: searchPostReducer,
    accounts: accountReducer
});

export default rootReducer;
