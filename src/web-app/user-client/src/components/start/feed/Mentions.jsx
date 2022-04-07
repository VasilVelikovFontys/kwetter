import React, {useEffect, useState} from 'react'
import '../../../styles/components/start/feed/mentions.css';
import {useDispatch, useSelector} from "react-redux";
import {getMentions} from "../../../store/actions/mentionsActions";
import Post from "../../profile/posts/Post";

const Mentions = () => {
    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);
    const {posts, postsError} = useSelector(state => state.mentions);

    const [styledPosts, setStyledPosts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (jwt) {
            setLoading(true);
            dispatch(getMentions())
                .then(() => {
                    setLoading(false);
                })
                .catch(error => {
                    setError(error)
                });
        }
    }, [dispatch, jwt]);

    useEffect(() => {
        if (postsError) {
            setError(postsError);
        }
    }, [postsError]);

    useEffect(() => {
        const newPosts = posts.map(post => <Post key={post.id} post={post}/>);

        setStyledPosts(newPosts)
    }, [posts]);

    return (
        <div id='mentions'>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {styledPosts.length > 0 ? styledPosts : 'No mentioning posts'}
                </>
            }

            {error && (
                <div>{error}</div>
            )}
        </div>
    )
}

export default Mentions;
