import React, {useEffect} from 'react';
import '../../../styles/components/profile/counts/counts.css';
import {getUserPosts} from "../../../store/actions/postActions";
import {useDispatch, useSelector} from "react-redux";
import {getFollowing} from "../../../store/actions/followingActions";
import {getFollowers} from "../../../store/actions/followerActions";
import {useNavigate} from "react-router-dom";
import Post from "../../common/Post";
import Picture from "../../profile/name-and-picture/Picture";

const Counts = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);

    const {user, loading: userLoading} = useSelector(state => state.currentUser)
    const {posts, loading: postsLoading} = useSelector(state => state.posts);
    const {following, loading: followingLoading} = useSelector(state => state.following);
    const {followers, loading: followersLoading} = useSelector(state => state.followers);

    const redirectToProfile = () => {
        navigate('/profile');
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

    const displayPicture = () => {
        if (userLoading) return <div>Loading...</div>
        if (!jwt || !user) return <div>No current user</div>

        return (
            <Picture picture={user.picture} own/>
        )
    }

    const displayPosts = () => {
        if (postsLoading) return <div>Loading...</div>
        return (
            <div className='count'>
                Your posts {posts.length}
            </div>
        )
    }

    const displayLastPost = () => {
        if (postsLoading || posts.length === 0) return null;
        return (
            <Post own post={posts[0]} />
        )
    }

    const displayFollowing = () => {
        if (followingLoading) return <div>Loading...</div>
        return (
            <div className='following-count count' onClick={redirectToProfile}>
                {following.length} following
            </div>
        )
    }

    const displayFollowers = () => {
        if (followersLoading) return <div>Loading...</div>
        return (
            <div className='following-count count' onClick={redirectToProfile}>
                {followers.length} follower{followers.length === 1 ? '' : 's'}
            </div>
        )
    }

    return (
        <div id='counts'>
            {jwt && (
                <>
                    <div>
                        {displayPosts()}
                        <div id='picture-and-post'>
                            {displayPicture()}
                            {displayLastPost()}
                        </div>
                    </div>
                    <div id='following-counts'>
                        {displayFollowing()}
                        {displayFollowers()}
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
