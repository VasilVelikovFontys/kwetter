import React, {useEffect, useState} from 'react'
import '../../../../styles/components/profile/list/posts/post.css';
import {getPostDate} from "../../../../utils/dates";
import {useDispatch, useSelector} from "react-redux";
import {likePost} from "../../../../store/actions/likeActions";

const Post = props => {
    const dispatch = useDispatch();

    const {post, own} = props;

    const {user} = useSelector(state => state.user);
    const {postId, loading, error: likeError} = useSelector(state => state.likes);

    const [error, setError] = useState('');

    const handleLike = () => {
        if (post.userId === user.id) return setError('Users cannot like their own post!');

        dispatch(likePost(post.id))
            .then(() => {
                //No action needed
            })
            .catch(postLikeError => {
                if (postLikeError.message) return setError(postLikeError.message)
                setError(postLikeError)
            });
    }

    const handleOk = () => {
        setError('');
    }

    useEffect(() => {
        if (likeError && postId === post.id) return setError(likeError);
    }, [likeError]);

    const displayLikes = () => {
        if (error) return (
            <div>
                <span className='post-error'>{error}</span>
                <span className='post-ok' onClick={handleOk}>OK</span>
            </div>
        );

        if (loading && postId === post.id) return <span>Loading...</span>;

        if (!user) return <span>Loading...</span>;

        let icon = <i className="fa-regular fa-heart post-heart" onClick={handleLike}/>;

        if (post.likes.indexOf(user.id) > -1) icon = <i className="fa-solid fa-heart post-heart" />;

        return <span>{post.likes.length} {icon}</span>
    }

    return (
        <div className='post'>
            {!own && (
                <div className='post-username'>
                    {post.username} posted:
                </div>
            )}
            <div className='post-text'>
                {post.text}
            </div>
            <div className='post-info'>
                <span>{getPostDate(post.date)}</span>
                {displayLikes()}
            </div>
        </div>
    )
}

export default Post;
