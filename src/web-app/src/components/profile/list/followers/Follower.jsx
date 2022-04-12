import React  from 'react'
import '../../../../styles/components/profile/list/followers/follower.css';

const Follower = props => {
    const {username} = props;

    return (
        <div className='follower'>
            {username}
        </div>
    )
}

export default Follower;
