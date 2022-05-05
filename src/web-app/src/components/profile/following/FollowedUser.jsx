import React  from 'react'
import '../../../styles/components/profile/following/followedUser.css';

const FollowedUser = props => {
    const {username, setSelectedUsername} = props;

    const handleSelectUsername = () => {
        setSelectedUsername(username);
    }

    return (
        <div className='followed-user'>
            <span onClick={handleSelectUsername}>{username}</span>
        </div>
    )
}

export default FollowedUser;
