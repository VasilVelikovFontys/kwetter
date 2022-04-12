import React, {useEffect, useState} from 'react'
import '../../../styles/components/start/feed/mentions.css';
import {useDispatch, useSelector} from "react-redux";
import {getMentions} from "../../../store/actions/mentionsActions";
import Post from "../../profile/list/posts/Post";

const Mentions = () => {
    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);
    const {mentions, loading: mentionsLoading, error: mentionsError} = useSelector(state => state.mentions);

    const [styledMentions, setStyledMentions] = useState([]);

    const [error, setError] = useState('');

    useEffect(() => {
        if (jwt) {
            dispatch(getMentions())
                .then(() => {
                    //No action needed
                })
                .catch(userMentionsError => {
                    if (userMentionsError.message) return setError(userMentionsError.message)
                    setError(userMentionsError)
                });
        }
    }, [dispatch, jwt]);

    useEffect(() => {
        if (mentionsError) return setError(mentionsError);
    }, [mentionsError]);

    useEffect(() => {
        const newMentions = mentions.map(post => <Post key={post.id} post={post}/>);

        setStyledMentions(newMentions)
    }, [mentions]);

    const displayMentions = () => {
        if (mentionsLoading) return <div>Loading...</div>
        if (styledMentions.length === 0) return <div>No mentioning posts</div>
        return <div>{styledMentions}</div>
    }

    return (
        <div id='mentions'>
            {displayMentions()}

            {error && (
                <div className="mentions-error">{error}</div>
            )}
        </div>
    )
}

export default Mentions;
