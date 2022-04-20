import React, {useEffect, useState} from 'react'
import '../../../styles/components/start/feed/timeline.css';
import {useDispatch, useSelector} from "react-redux";
import Post from "../../common/Post";
import {getTimelinePosts} from "../../../store/actions/timelineActions";

const Timeline = () => {
    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);
    const {posts, loading: postsLoading, error: postsError} = useSelector(state => state.timeline);

    const [styledPosts, setStyledPosts] = useState([]);

    const [error, setError] = useState('');

    useEffect(() => {
        if (jwt) {
            dispatch(getTimelinePosts())
                .then(() => {
                    //No action needed
                })
                .catch(timelinePostsError => {
                    if (timelinePostsError.message) return setError(timelinePostsError.message)
                    setError(timelinePostsError)
                });
        }
    }, [dispatch, jwt]);

    useEffect(() => {
        if (postsError) return setError(postsError);
    }, [postsError]);

    useEffect(() => {
        const newPosts = posts.map(post => <Post key={post.id} post={post}/>);

        setStyledPosts(newPosts)
    }, [posts]);

    const displayPosts = () => {
        if (postsLoading) return <div>Loading...</div>
        if (styledPosts.length === 0) return <div>No timeline posts</div>
        return <div>{styledPosts}</div>
    }

    return (
        <div id='timeline'>
            {displayPosts()}

            {error && (
                <div className="timeline-error">{error}</div>
            )}
        </div>
    )
}

export default Timeline;
