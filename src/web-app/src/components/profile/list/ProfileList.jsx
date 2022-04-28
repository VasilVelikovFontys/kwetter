import React from 'react'
import Posts from "./Posts";
import Followers from "./Followers";
import {FOLLOWERS_LIST, POSTS_LIST} from "../../../constants";

const ProfileList = props => {
    const {selectedList} = props;

    return (
        <div id='profile-list'>
            {selectedList === POSTS_LIST && (
                <Posts/>
            )}
            {selectedList === FOLLOWERS_LIST && (
                <Followers/>
            )}
        </div>
    )
}

export default ProfileList;
