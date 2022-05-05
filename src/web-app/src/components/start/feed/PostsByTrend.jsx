import React, {useEffect, useState} from 'react'
import '../../../styles/components/start/feed/timeline.css';
import {useSelector} from "react-redux";
import Post from "../../common/Post";

const PostsByTrend = props => {
    const {posts, loading: postsLoading, error: postsError} = useSelector(state => state.trendPosts);

    const {setSelectedUsername} = props;

    const [styledPosts, setStyledPosts] = useState([]);

    const [error, setError] = useState('');

    useEffect(() => {
        if (postsError) return setError(postsError);
    }, [postsError]);

    useEffect(() => {
        const newPosts = posts.map(post => <Post key={post.id} post={post} setSelectedUsername={setSelectedUsername}/>);

        setStyledPosts(newPosts)
    }, [posts]);

    const displayPosts = () => {
        if (postsLoading) return <div>Loading...</div>
        if (styledPosts.length === 0) return <div>No posts for this trend</div>
        return <div>{styledPosts}</div>
    }

    return (
        <div id='posts-by-trend'>
            {displayPosts()}

            {error && (
                <div className="posts-by-trend-error">{error}</div>
            )}
        </div>
    )
}

export default PostsByTrend;
