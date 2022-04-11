import React, {useEffect, useState} from 'react';
import '../../../styles/components/profile/posts/posts.css';
import {useDispatch, useSelector} from "react-redux";
import {getUserPosts} from "../../../store/actions/postActions";
import Post from "./Post";

const Posts = () => {
    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);
    const {posts, postsError} = useSelector(state => state.posts);

    const [styledPosts, setStyledPosts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if(jwt) {
            setLoading(true);
            dispatch(getUserPosts())
                .then(() => {
                    setLoading(false);
                })
                .catch(userPostsError => {
                    setLoading(false);

                    if (userPostsError.message) return setError(userPostsError.message)
                    setError(userPostsError);
                });
        }
    }, [dispatch, jwt]);

    useEffect(() => {
        if (postsError) {
            setError(postsError);
        }
    }, [postsError]);

    useEffect(() => {
        if (!posts) return;
        const newPosts = posts.map(post => <Post key={post.id} post={post} own/>);

        setStyledPosts(newPosts)
    }, [posts]);

    return (
        <div id='posts'>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {styledPosts.length > 0 ? styledPosts : 'No recent posts'}
                </>
            }

            {error && (
                <div className="posts-error">{error}</div>
            )}
        </div>
    )
}

export default Posts;
