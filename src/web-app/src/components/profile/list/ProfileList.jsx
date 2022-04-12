import React from 'react'
import Posts from "./posts/Posts";
import Followers from "./followers/Followers";

const ProfileList = props => {
    const {selectedList} = props;

    return (
        <div id='profile-list'>
            {selectedList === 'posts' && (
                <Posts/>
            )}
            {selectedList === 'followers' && (
                <Followers/>
            )}
        </div>
    )
}

export default ProfileList;
