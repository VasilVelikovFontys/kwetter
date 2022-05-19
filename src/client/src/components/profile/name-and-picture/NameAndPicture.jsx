import React  from 'react'
import '../../../styles/components/profile/name-and-picture/nameAndPicture.css';
import {useSelector} from "react-redux";
import Picture from "./Picture";

const NameAndPicture = () => {
    const {jwt} = useSelector(state => state.auth);
    const {user} = useSelector(state => state.currentUser);
    const {loading: pictureLoading, error: pictureError} = useSelector(state => state.picture);

    const displayUser = () => {
        if (pictureLoading) return <div>Loading...</div>
        if (!jwt || !user) return <div>No current user</div>

        const {username, picture} = user;
        return (
            <div id="name-and-picture-container">
                <Picture picture={picture} own/>
                <span>{username}</span>
            </div>
        )
    }

    return (
        <div id='name-and-picture'>
            {displayUser()}

            {pictureError && (
                <div className="name-and-picture-error">
                    {pictureError.message ? pictureError.message : pictureError}
                </div>
            )}
        </div>
    )
}

export default NameAndPicture;
