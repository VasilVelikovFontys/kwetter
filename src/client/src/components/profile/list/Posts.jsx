import React, {useEffect, useState} from 'react';
import '../../../styles/components/profile/list/posts/posts.css';
import {useSelector} from "react-redux";
import Post from "../../common/Post";

const Posts = () => {
    const {jwt} = useSelector(state => state.auth);
    const {posts, loading: postsLoading, error: postsError} = useSelector(state => state.posts);

    const [styledPosts, setStyledPosts] = useState([]);

    useEffect(() => {
        if (!posts) return;
        const newPosts = posts.map(post => <Post key={post.id} post={post} own/>);

        setStyledPosts(newPosts);
    }, [posts]);

    useEffect(() => {
        if (!jwt) return setStyledPosts([]);
    }, [jwt]);

    const displayPosts = () => {
        if (postsLoading) return <div>Loading...</div>
        if (styledPosts.length === 0) return <div>No recent posts</div>
        return <div>{styledPosts}</div>
    }

    return (
        <div id='posts'>
            <div id='posts-title'>Posts</div>

            {displayPosts()}

            {postsError && (
                <div className="posts-error">
                    {postsError.message ? postsError.message : postsError}
                </div>
            )}
        </div>
    )
}

export default Posts;
