import React  from 'react'
import '../../../../styles/components/profile/list/posts/post.css';
import {getPostDate} from "../../../../utils/dates";

const Post = props => {
    const {post, own} = props;

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
            <div>
                {getPostDate(post.date)}
            </div>
        </div>
    )
}

export default Post;
