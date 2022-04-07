import React  from 'react'
import '../styles/pages/profile.css';
import AuthBar from "../components/auth/AuthBar";
import NameAndPicture from "../components/profile/name-and-picture/NameAndPicture";
import Details from "../components/profile/details/Details";
import Posts from "../components/profile/posts/Posts";
import Counts from "../components/profile/counts/Counts";
import Following from "../components/profile/following/Following";

const Profile = () => {
    return (
        <div id='profile-page'>
            <AuthBar />

            <div id='profile-contents'>
                <div className='profile-column'>
                    <NameAndPicture />
                    <Posts />
                </div>

                <div className='profile-column'>
                    <Details />
                    <Counts />
                    <Following />
                </div>
            </div>
        </div>
    )
}

export default Profile;
