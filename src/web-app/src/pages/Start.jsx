import React  from 'react'
import '../styles/pages/start.css';
import AuthBar from "../components/auth/AuthBar";
import PostBar from "../components/start/posting/PostBar";
import Feed from "../components/start/feed/Feed";

const Start = () => {
    return (
        <div id='start-page'>
            <AuthBar />

            <div id='start-contents'>
                <div className='start-column'>
                    <PostBar />
                    <Feed />
                </div>
                <div className='start-column'>

                </div>
            </div>
        </div>
    )
}

export default Start
