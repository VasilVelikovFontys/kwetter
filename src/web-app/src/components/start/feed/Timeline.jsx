import React, {useEffect, useState} from 'react'
import '../../../styles/components/start/feed/timeline.css';
import {useDispatch, useSelector} from "react-redux";
import Post from "../../common/Post";
import {getTimelinePosts} from "../../../store/actions/timelineActions";

const Timeline = props => {
    const dispatch = useDispatch();

    const {setSelectedUsername} = props;

    const {jwt} = useSelector(state => state.auth);
    const {posts: timelinePosts, loading: timelinePostsLoading, error: timelinePostsError} = useSelector(state => state.timeline);
    const {posts: searchPosts, loading: searchPostsLoading, error: searchPostsError} = useSelector(state => state.searchPosts);

    const [styledPosts, setStyledPosts] = useState([]);

    const [error, setError] = useState('');

    useEffect(() => {
        if (jwt && searchPosts.length === 0 && searchPostsLoading !== true) {
            dispatch(getTimelinePosts())
                .then(() => {
                    //No action needed
                });
        }
    }, [dispatch, jwt]);

    useEffect(() => {
        if (timelinePostsError) return setError(timelinePostsError);
    }, [timelinePostsError]);

    useEffect(() => {
        if (searchPostsError) return setError(searchPostsError);
    }, [searchPostsError]);

    useEffect(() => {
        const newPosts = timelinePosts.map(post => <Post key={post.postId} post={post} setSelectedUsername={setSelectedUsername}/>);

        setStyledPosts(newPosts)
    }, [timelinePosts]);

    useEffect(() => {
        const newPosts = searchPosts.map(post => <Post key={post.postId} post={post} setSelectedUsername={setSelectedUsername}/>);

        setStyledPosts(newPosts);
    }, [searchPosts]);

    const displayPosts = () => {
        if (timelinePostsLoading || searchPostsLoading) return <div>Loading...</div>
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
