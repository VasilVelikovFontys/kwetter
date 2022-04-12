import React, {useEffect, useState} from 'react';
import '../../../../styles/components/profile/list/followers/followers.css';
import {useSelector} from "react-redux";
import Follower from "./Follower";

const Followers = () => {
    const {jwt} = useSelector(state => state.auth);
    const {followers, loading: followersLoading, error: followersError} = useSelector(state => state.followers);

    const [styledPosts, setStyledPosts] = useState([]);

    useEffect(() => {
        if (!followers) return;
        const newPosts = followers.map(username => <Follower key={username} username={username}/>);

        setStyledPosts(newPosts);
    }, [followers]);

    useEffect(() => {
        if (!jwt) return setStyledPosts([]);
    }, [jwt]);

    return (
        <div id='followers'>
            {followersLoading ?
                <div>Loading...</div>
                :
                <>
                    {styledPosts.length > 0 ? styledPosts : 'No followers'}
                </>
            }

            {followersError && (
                <div className="followers-error">
                    {followersError.message ? followersError.message : followersError}
                </div>
            )}
        </div>
    )
}

export default Followers;
