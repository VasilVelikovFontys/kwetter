import React, {useEffect, useState} from 'react';
import '../../../styles/components/profile/counts/counts.css';
import {getUserPosts} from "../../../store/actions/postActions";
import {useDispatch, useSelector} from "react-redux";
import {getFollowing} from "../../../store/actions/followingActions";
import {getFollowers} from "../../../store/actions/followersActions";

const Counts = props => {
    const {setSelectedList} = props;

    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);

    const {posts, loading: postsLoading} = useSelector(state => state.posts);
    const {following, loading: followingLoading} = useSelector(state => state.following);
    const {followers, loading: followersLoading} = useSelector(state => state.followers);

    const [error, setError] = useState('');

    const showPosts = () => {
        setSelectedList('posts');
    }

    const showFollowers = () => {
        setSelectedList('followers');
    }

    useEffect(() => {
        if(jwt) {
            dispatch(getUserPosts())
                .then(() => {})
                .catch((postsError) => {
                    if (postsError.message) return setError(postsError.message)
                    setError(postsError);
                });

            dispatch(getFollowing())
                .then(() => {})
                .catch((followingError) => {
                    if (followingError.message) return setError(followingError.message)
                    setError(followingError);
                });

            dispatch(getFollowers())
                .then(() => {})
                .catch((followersError) => {
                    if (followersError.message) return setError(followersError.message)
                    setError(followersError);
                });
        }
    }, [dispatch, jwt]);

    return (
        <div id='counts'>
            {jwt ?
                <>
                    <div id='following-counts'>
                        {followingLoading ?
                            <div>Loading...</div>
                            :
                            <div className='following-count count'>
                                {following.length} following
                            </div>
                        }

                        {followersLoading ?
                            <div>Loading...</div>
                            :
                            <div className='following-count count' onClick={showFollowers}>
                                {followers.length} follower{followers.length === 1 ? '' : 's'}
                            </div>
                        }
                    </div>
                    <div>
                        {postsLoading ?
                            <div>Loading...</div>
                            :
                            <div className='count' onClick={showPosts}>
                                {posts.length} post{posts.length === 1 ? '' : 's'}
                            </div>
                        }
                    </div>

                    {error && (
                        <div className='count-error'>
                            {error}
                        </div>
                    )}
                </>
                :
                <>
                    No information
                </>
            }
        </div>
    )
}

export default Counts;
