import React, {useEffect, useState} from 'react'
import '../../../styles/components/start/posting/postBar.css';
import {postIsValid} from "../../../utils/validator";
import {useDispatch, useSelector} from "react-redux";
import {createPost} from "../../../store/actions/postActions";

const PostBar = () => {
    const dispatch = useDispatch();
    const {postsError} = useSelector(state => state.posts);

    const [text, setText] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTextChange = e => {
        setText(e.target.value);
    };

    const handlePost = () => {
        if (!postIsValid(text)) return setError('Invalid post!');

        setLoading(true);
        dispatch(createPost(text))
            .then(() => {
                setLoading(false);
                setText('');
            })
            .catch(postError => {
                setLoading(false);

                if (postError.message) return setError(postError.message);
                setError(postError)
            });
    }

    useEffect(() => {
        if (postsError) {
            setError(postsError);
        }
    }, [postsError])

    return (
        <div id='post-bar'>
            <div id='post-bar-title'>
                What's happening?
            </div>
            <input id='post-input'
                   value={text}
                   placeholder={'Text'}
                   onChange={handleTextChange}
            />
            <div id='post-button'
                 onClick={handlePost}
            >
                Post
            </div>

            {loading && (
                <div>
                    Loading...
                </div>
            )}

            {error && (
                <div id='post-error'>
                    {error}
                </div>
            )}
        </div>
    )
}

export default PostBar
