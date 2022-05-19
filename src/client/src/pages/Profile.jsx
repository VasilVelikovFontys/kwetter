import React, {useState} from 'react'
import '../styles/pages/profile.css';
import AuthBar from "../components/auth/AuthBar";
import NameAndPicture from "../components/profile/name-and-picture/NameAndPicture";
import Details from "../components/profile/details/Details";
import Counts from "../components/profile/counts/Counts";
import Following from "../components/profile/following/Following";
import ProfileList from "../components/profile/list/ProfileList";
import User from "../components/common/User";

const Profile = () => {
    const [selectedList, setSelectedList] = useState('posts');
    const [selectedUsername, setSelectedUsername] = useState('');

    return (
        <div id='profile-page'>
            <AuthBar />

            <div id='profile-contents'>
                <div className='profile-column'>
                    <NameAndPicture />
                    <ProfileList selectedList={selectedList}
                                 setSelectedUsername={setSelectedUsername}
                    />
                </div>

                <div className='profile-column'>
                    <Details />
                    <Counts setSelectedList={setSelectedList}/>
                    <Following setSelectedUsername={setSelectedUsername}/>
                    <User username={selectedUsername}/>
                </div>
            </div>
        </div>
    )
}

export default Profile;
