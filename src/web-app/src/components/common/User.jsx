import React, {useEffect, useState} from 'react'
import '../../styles/components/common/user.css';
import {useDispatch, useSelector} from "react-redux";
import {getUserByUsername} from "../../store/actions/userActions";
import Picture from "../profile/name-and-picture/Picture";
import {followUser} from "../../store/actions/followActions";
import {SET_FOLLOW_ERROR} from "../../constants";
import Error from "./Error";

const User = props => {
    const dispatch = useDispatch();

    const {username} = props;

    const {user, loading: userLoading, error: userError} = useSelector(state => state.user);
    const {username: followedUsername, loading: followLoading, error: followError} = useSelector(state => state.follow);
    const {following} = useSelector(state => state.following);

    const [error, setError] = useState('');

    useEffect(() => {
        if (!username) return;

        dispatch(getUserByUsername(username))
            .then(() => {
                //No action needed
            });
    }, [username]);

    const displayUser = () => {
        if (userLoading || followLoading) return <div>Loading...</div>
        if (!user) return <div>No selected user</div>

        const {picture, firstName, lastName, location, website, bio} = user;

        return <div className='user'>
            <Picture picture={picture}/>
            <div className='user-details'>
                <div>
                    <b>Name:</b> {firstName} {lastName}
                </div>
                <div>
                    <b>Location:</b> {location}
                </div>
                <div>
                    <b>Web:</b> {website}
                </div>
                <div>
                    <b>Bio:</b> {bio}
                </div>
            </div>

            {following && following.indexOf(username) < 0 && (
                <div className='follow-button' onClick={handleFollow}>
                    Follow
                </div>
            )}
        </div>
    }

    const handleFollow = () => {
        dispatch(followUser(user.username))
            .then(() => {
                //No action needed
            });
    }

    const handleOk = () => {
        dispatch({type: SET_FOLLOW_ERROR, error: null, username: null});
        setError('');
    }

    useEffect(() => {
        if (userError) return setError(userError);
    }, [userError]);

    useEffect(() => {
        if (followError && username === followedUsername) return setError(followError);
    }, [followError]);

    return (
        <div id='user-container'>
            <div id='user-title'>
                User
            </div>

            {displayUser()}

            {error && (
                <Error message={error} handleOk={handleOk} />
            )}
        </div>
    )
}

export default User;
