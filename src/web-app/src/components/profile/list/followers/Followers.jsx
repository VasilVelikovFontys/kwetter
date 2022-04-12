import React, {useEffect, useState} from 'react';
import '../../../../styles/components/profile/list/followers/followers.css';
import {useSelector} from "react-redux";
import Follower from "./Follower";

const Followers = () => {
    const {jwt} = useSelector(state => state.auth);
    const {followers, loading: followersLoading, error: followersError} = useSelector(state => state.followers);

    const [styledFollowers, setStyledFollowers] = useState([]);

    useEffect(() => {
        if (!followers) return;
        const newFollowers = followers.map(username => <Follower key={username} username={username}/>);

        setStyledFollowers(newFollowers);
    }, [followers]);

    useEffect(() => {
        if (!jwt) return setStyledFollowers([]);
    }, [jwt]);

    const displayFollowers = () => {
        if (followersLoading) return <div>Loading...</div>
        if (styledFollowers.length === 0) return <div>No followers</div>
        return <div>{styledFollowers}</div>
    }

    return (
        <div id='followers'>
            {displayFollowers()}

            {followersError && (
                <div className="followers-error">
                    {followersError.message ? followersError.message : followersError}
                </div>
            )}
        </div>
    )
}

export default Followers;
