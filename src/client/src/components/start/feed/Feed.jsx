import React from 'react'
import '../../../styles/components/start/feed/feed.css';
import Mentions from "./Mentions";
import Timeline from "./Timeline";
import PostsByTrend from "./PostsByTrend";
import {MENTIONS_TAB, POSTS_BY_TREND_LIST, SET_SEARCH_POSTS, TIMELINE_LIST, TIMELINE_TAB} from "../../../constants";
import {useDispatch} from "react-redux";

const Feed = props => {
    const {timelineList, setTimelineList, setSelectedUsername, selectedTab, setSelectedTab} = props;

    const dispatch = useDispatch();

    const handleTabChange = tab => {
        if (tab !== selectedTab) {
            dispatch({type: SET_SEARCH_POSTS, posts: []});
        }
        setTimelineList(TIMELINE_LIST);
        setSelectedTab(tab);
    }

    return (
        <>
            <div id='feed-tabs'>
                <div onClick={() => handleTabChange(TIMELINE_TAB)}
                     className={`feed-tab${selectedTab === TIMELINE_TAB ? '-selected' : ''}`}
                >
                    Timeline
                </div>
                <div onClick={() => handleTabChange(MENTIONS_TAB)}
                     className={`feed-tab${selectedTab === MENTIONS_TAB ? '-selected' : ''}`}
                >
                    @Mentions
                </div>
            </div>

            <div id='feed'>
                {selectedTab === TIMELINE_TAB && timelineList === TIMELINE_LIST && (
                    <Timeline setSelectedUsername={setSelectedUsername}/>
                )}

                {selectedTab === TIMELINE_TAB && timelineList === POSTS_BY_TREND_LIST && (
                    <PostsByTrend setSelectedUsername={setSelectedUsername}/>
                )}

                {selectedTab === MENTIONS_TAB && (
                    <Mentions setSelectedUsername={setSelectedUsername}/>
                )}
            </div>
        </>
    )
}

export default Feed;
