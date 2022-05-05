import React, {useState} from 'react'
import '../styles/pages/start.css';
import AuthBar from "../components/auth/AuthBar";
import PostBar from "../components/start/posting/PostBar";
import Feed from "../components/start/feed/Feed";
import Counts from "../components/start/counts/Counts";
import Trends from "../components/start/trends/Trends";
import {TIMELINE_LIST} from "../constants";
import User from "../components/common/User";

const Start = () => {
    const [timelineList, setTimelineList] = useState(TIMELINE_LIST);
    const [selectedUsername, setSelectedUsername] = useState('');

    return (
        <div id='start-page'>
            <AuthBar />

            <div id='start-contents'>
                <div className='start-column'>
                    <PostBar />
                    <Feed timelineList={timelineList}
                          setTimelineList={setTimelineList}
                          setSelectedUsername={setSelectedUsername}
                    />
                </div>
                <div className='start-column'>
                    <Counts />
                    <Trends setTimelineList={setTimelineList}/>
                    <User username={selectedUsername}/>
                </div>
            </div>
        </div>
    )
}

export default Start
