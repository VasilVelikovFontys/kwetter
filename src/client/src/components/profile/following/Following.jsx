import React, {useEffect, useState} from 'react';
import '../../../styles/components/profile/following/following.css';
import {useSelector} from "react-redux";
import FollowedUser from "./FollowedUser";

const Following = props => {
    const {setSelectedUsername} = props;

    const {jwt} = useSelector(state => state.auth);
    const {following, loading: followingLoading, error: followingError} = useSelector(state => state.following);

    const [styledFollowing, setStyledFollowing] = useState([]);

    useEffect(() => {
        if (!following) return;
        const newFollowing = following.map(username => <FollowedUser key={username} username={username} setSelectedUsername={setSelectedUsername}/>);

        setStyledFollowing(newFollowing);
    }, [following]);

    useEffect(() => {
        if (!jwt) return setStyledFollowing([]);
    }, [jwt]);

    const displayFollowing = () => {
        if (followingLoading) return <div>Loading...</div>
        if (styledFollowing.length === 0) return <div>No followed users</div>
        return <div>{styledFollowing}</div>
    }

    return (
        <div id='following'>
            <div id='following-title'>Following</div>

            {displayFollowing()}

            {followingError && (
                <div className="following-error">
                    {followingError.message ? followingError.message : followingError}
                </div>
            )}
        </div>
    )
}

export default Following;
