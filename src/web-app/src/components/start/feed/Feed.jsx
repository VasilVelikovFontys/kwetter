import React, {useState} from 'react'
import '../../../styles/components/start/feed/feed.css';
import Mentions from "./Mentions";
import Timeline from "./Timeline";

const Feed = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = tab => {
        setSelectedTab(tab);
    }

    return (
        <>
            <div id='feed-tabs'>
                <div onClick={() => handleTabChange(0)}
                     className={`feed-tab${selectedTab === 0 ? '-selected' : ''}`}
                >
                    Timeline
                </div>
                <div onClick={() => handleTabChange(1)}
                     className={`feed-tab${selectedTab === 1 ? '-selected' : ''}`}
                >
                    @Mentions
                </div>
            </div>

            <div id='feed'>
                {selectedTab === 0 && (
                    <Timeline />
                )}
                {selectedTab === 1 && (
                    <Mentions />
                )}
            </div>
        </>
    )
}

export default Feed;
