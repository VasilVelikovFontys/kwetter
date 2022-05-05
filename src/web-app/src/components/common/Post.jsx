import React, {useEffect, useRef, useState} from 'react'
import '../../styles/components/common/post.css';
import {getPostDate} from "../../utils/dates";
import {useDispatch, useSelector} from "react-redux";
import {likePost} from "../../store/actions/likeActions";
import {SET_LIKE_ERROR} from "../../constants";
import Error from "./Error";

const Post = props => {
    const dispatch = useDispatch();

    const usernameSpan = useRef();
    const textSpan = useRef();

    const {post, own, setSelectedUsername} = props;

    const {user} = useSelector(state => state.currentUser);
    const {postId, loading, error: likeError} = useSelector(state => state.likes);

    const [error, setError] = useState('');

    const handleLike = () => {
        dispatch(likePost(post.id))
            .then(() => {
                //No action needed
            });
    }

    const handleOk = () => {
        dispatch({type: SET_LIKE_ERROR, error: null, postId: null});
        setError('');
    }

    const handleUsernameClick = () => {
        setSelectedUsername(post.username);
    }

    useEffect(() => {
        if (likeError && postId === post.id) return setError(likeError);
    }, [likeError]);

    useEffect(() => {
        if (postId !== post.id) return setError('');
    }, [postId]);

    useEffect(() => {
        if (post._highlightResult) {
            usernameSpan.current.innerHTML = post._highlightResult.username.value;
            textSpan.current.innerHTML = post._highlightResult.text.value;
        }
    }, [post]);

    const displayUsername = () => {
        if (post._highlightResult) {
            return <span contentEditable ref={usernameSpan} />;
        } else {
            return post.username;
        }
    }

    const displayText = () => {
        if (post._highlightResult) {
            return <span contentEditable ref={textSpan} />;
        } else {
            return post.text;
        }
    }

    const displayLikes = () => {
        if (loading && postId === post.id) return <span>Loading...</span>;

        if (!user) return <span>Loading...</span>;

        let icon = <i className="fa-regular fa-heart post-heart" onClick={handleLike}/>;

        if (post.likes.indexOf(user.id) > -1) icon = <i className="fa-solid fa-heart post-heart" />;

        return <span>{post.likes.length} {icon}</span>
    }

    return (
        <div className='post'>
            {!own && (
                <div className='post-title' onClick={handleUsernameClick}>
                    <span className='post-username'>
                        {displayUsername()}
                    </span>
                    <span> posted:</span>
                </div>
            )}
            <div className='post-text'>
                {displayText()}
            </div>
            <div className='post-info'>
                <span>{getPostDate(post.date)}</span>
                {displayLikes()}
            </div>

            {error && (
                <Error message={error} handleOk={handleOk}/>
            )}
        </div>
    )
}

export default Post;
