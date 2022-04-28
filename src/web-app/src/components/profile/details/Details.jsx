import React, {useEffect, useState} from 'react';
import '../../../styles/components/profile/details/details.css';
import {useDispatch, useSelector} from "react-redux";
import {bioIsValid, locationIsValid, nameIsValid, websiteIsValid} from "../../../utils/validator";
import {setDetails} from "../../../store/actions/detailsActions";

const Details = () => {
    const dispatch = useDispatch();

    const {jwt} = useSelector(state => state.auth);
    const {user} = useSelector(state => state.user);
    const {loading: detailsLoading, error: detailsError} = useSelector(state => state.details);

    const [updating, setUpdating] = useState(false);

    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [newWebsite, setNewWebsite] = useState('');
    const [newBio, setNewBio] = useState(user ? user.bio : '');

    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;

        setNewFirstName(user.firstName);
        setNewLastName(user.lastName);
        setNewLocation(user.location);
        setNewWebsite(user.website);
        setNewBio(user.bio);

    }, [user, updating]);

    useEffect(() => {
        if (detailsError) return setError(detailsError);
    }, [detailsError]);

    const handleUpdate = () => {
        setUpdating(true);
    }

    const handleSave = () => {
        if (!nameIsValid(newFirstName)) return setError('First name is invalid!');
        if (!nameIsValid(newLastName)) return setError('Last name is invalid!');
        if (!locationIsValid(newLocation)) return setError('Location is invalid!');
        if (!websiteIsValid(newWebsite)) return setError('Website is invalid!');
        if (!bioIsValid(newBio)) return setError('Bio is invalid!');

        dispatch(setDetails({
            firstName: newFirstName,
            lastName: newLastName,
            location: newLocation,
            website: newWebsite,
            bio: newBio
        }))
            .then(() => {
                //No action needed
            })
            .catch(detailsError => {
                if (detailsError.message) return setError(detailsError.message)
                setError(detailsError);
            });

        setUpdating(false);
    }

    const handleFirstNameChange = e => {
        setNewFirstName(e.target.value);
    }

    const handleLastNameChange = e => {
        setNewLastName(e.target.value);
    }

    const handleLocationChange = e => {
        setNewLocation(e.target.value);
    }

    const handleWebsiteChange = e => {
        setNewWebsite(e.target.value);
    }

    const handleBioChange = e => {
        setNewBio(e.target.value);
    }

    const displayDetails = () => {
        if (detailsLoading) return <div>Loading...</div>
        if (!jwt || !user) return <div>No current user</div>

        const {firstName, lastName, location, website, bio} = user;
        return (
            <div id="details-container">
                {updating ? (
                    <>
                        <div>
                            <b>First Name:</b>
                            <input value={newFirstName} onChange={handleFirstNameChange}/>
                        </div>
                        <div>
                            <b>Last Name:</b>
                            <input value={newLastName} onChange={handleLastNameChange}/>
                        </div>
                        <div>
                            <b>Location:</b>
                            <input value={newLocation} onChange={handleLocationChange}/>
                        </div>
                        <div>
                            <b>Web:</b>
                            <input value={newWebsite} onChange={handleWebsiteChange}/>
                        </div>
                        <div>
                            <b>Bio:</b>
                            <input value={newBio} onChange={handleBioChange}/>
                        </div>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        )
    }

    return (
        <div id='details'>
            {displayDetails()}

            {error && (
                <div className="details-error">
                    {error.message ? error.message : error}
                </div>
            )}

            {user && !updating && (
                <span id='update-button' onClick={handleUpdate}>
                    Update
                </span>
            )}

            {user && updating && (
                <span id='update-button' onClick={handleSave}>
                    Save
                </span>
            )}
        </div>
    )
}

export default Details;
