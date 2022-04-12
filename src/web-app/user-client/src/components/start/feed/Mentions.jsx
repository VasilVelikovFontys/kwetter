import React, {useEffect, useState} from 'react'
import '../../../styles/components/start/feed/mentions.css';
import {useDispatch, useSelector} from "react-redux";
import {getMentions} from "../../../store/actions/mentionsActions";
import Post from "../../profile/list/posts/Post";

const Mentions = () => {
    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);
    const {mentions, loading: mentionsLoading, error: mentionsError} = useSelector(state => state.mentions);

    const [styledPosts, setStyledPosts] = useState([]);

    const [error, setError] = useState('');

    useEffect(() => {
        if (jwt) {
            dispatch(getMentions())
                .then(() => {})
                .catch(mentionsError => {
                    if (mentionsError.message) return setError(mentionsError.message)
                    setError(mentionsError)
                });
        }
    }, [dispatch, jwt]);

    useEffect(() => {
        if (mentionsError) return setError(mentionsError);
    }, [mentionsError]);

    useEffect(() => {
        const newMentions = mentions.map(post => <Post key={post.id} post={post}/>);

        setStyledPosts(newMentions)
    }, [mentions]);

    return (
        <div id='mentions'>
            {mentionsLoading ?
                <div>Loading...</div>
                :
                <>
                    {styledPosts.length > 0 ? styledPosts : 'No mentioning posts'}
                </>
            }

            {error && (
                <div className="mentions-error">{error}</div>
            )}
        </div>
    )
}

export default Mentions;
