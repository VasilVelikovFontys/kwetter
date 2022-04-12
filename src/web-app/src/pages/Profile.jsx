import React, {useState} from 'react'
import '../styles/pages/profile.css';
import AuthBar from "../components/auth/AuthBar";
import NameAndPicture from "../components/profile/name-and-picture/NameAndPicture";
import Details from "../components/profile/details/Details";
import Counts from "../components/profile/counts/Counts";
import Following from "../components/profile/following/Following";
import ProfileList from "../components/profile/list/ProfileList";

const Profile = () => {
    const [selectedList, setSelectedList] = useState('posts');

    return (
        <div id='profile-page'>
            <AuthBar />

            <div id='profile-contents'>
                <div className='profile-column'>
                    <NameAndPicture />
                    <ProfileList selectedList={selectedList}/>
                </div>

                <div className='profile-column'>
                    <Details />
                    <Counts setSelectedList={setSelectedList}/>
                    <Following />
                </div>
            </div>
        </div>
    )
}

export default Profile;
