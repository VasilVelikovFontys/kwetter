import React  from 'react'
import '../../../styles/components/profile/list/followers/follower.css';

const Follower = props => {
    const {username, setSelectedUsername} = props;

    const handleSelectUsername = () => {
        setSelectedUsername(username);
    }

    return (
        <div className='follower'>
            <span onClick={handleSelectUsername}>{username}</span>
        </div>
    )
}

export default Follower;
