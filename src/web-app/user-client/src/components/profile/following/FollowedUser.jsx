import React  from 'react'
import '../../../styles/components/profile/following/followedUser.css';

const FollowedUser = props => {
    const {username} = props;

    return (
        <div className='followed-user'>
            {username}
        </div>
    )
}

export default FollowedUser;
