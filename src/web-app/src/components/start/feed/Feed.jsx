import React, {useState} from 'react'
import '../../../styles/components/start/feed/feed.css';
import Mentions from "./Mentions";
import Timeline from "./Timeline";
import PostsByTrend from "./PostsByTrend";
import {MENTIONS_TAB, POSTS_BY_TREND_LIST, TIMELINE_LIST, TIMELINE_TAB} from "../../../constants";

const Feed = props => {
    const {timelineList, setTimelineList} = props;
    const [selectedTab, setSelectedTab] = useState(TIMELINE_TAB);

    const handleTabChange = tab => {
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
                    <Timeline />
                )}

                {selectedTab === TIMELINE_TAB && timelineList === POSTS_BY_TREND_LIST && (
                    <PostsByTrend />
                )}

                {selectedTab === MENTIONS_TAB && (
                    <Mentions />
                )}
            </div>
        </>
    )
}

export default Feed;
