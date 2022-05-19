import React, {useEffect} from 'react';
import '../../../styles/components/profile/counts/counts.css';
import {getUserPosts} from "../../../store/actions/postActions";
import {useDispatch, useSelector} from "react-redux";
import {getFollowing} from "../../../store/actions/followingActions";
import {getFollowers} from "../../../store/actions/followerActions";
import {FOLLOWERS_LIST, POSTS_LIST} from "../../../constants";

const Counts = props => {
    const {setSelectedList} = props;

    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);

    const {posts, loading: postsLoading} = useSelector(state => state.posts);
    const {following, loading: followingLoading} = useSelector(state => state.following);
    const {followers, loading: followersLoading} = useSelector(state => state.followers);

    const showPosts = () => {
        setSelectedList(POSTS_LIST);
    }

    const showFollowers = () => {
        setSelectedList(FOLLOWERS_LIST);
    }

    useEffect(() => {
        if(jwt) {
            dispatch(getUserPosts())
                .then(() => {
                    //No need for action
                });

            dispatch(getFollowing())
                .then(() => {
                    //No need for action
                });

            dispatch(getFollowers())
                .then(() => {
                    //No need for action
                });
        }
    }, [dispatch, jwt]);

    const displayFollowing = () => {
        if (followingLoading) return <div>Loading...</div>
        return (
            <div className='following-count count'>
                {following.length} following
            </div>
        )
    }

    const displayFollowers = () => {
        if (followersLoading) return <div>Loading...</div>
        return (
            <div className='following-count count' onClick={showFollowers}>
                {followers.length} follower{followers.length === 1 ? '' : 's'}
            </div>
        )
    }

    const displayPosts = () => {
        if (postsLoading) return <div>Loading...</div>
        return (
            <div className='count' onClick={showPosts}>
                {posts.length} post{posts.length === 1 ? '' : 's'}
            </div>
        )
    }

    return (
        <div id='counts'>
            {jwt && (
                <>
                    <div id='following-counts'>
                        {displayFollowing()}
                        {displayFollowers()}
                    </div>
                    <div>
                        {displayPosts()}
                    </div>
                </>
            )}

            {!jwt && (
                <div>No information</div>
            )}
        </div>
    )
}

export default Counts;
