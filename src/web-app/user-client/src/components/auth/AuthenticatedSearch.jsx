import React from "react";
import '../../styles/components/auth/authenticatedSearch.css';
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../store/actions/authActions";

const AuthenticatedSearch = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.user);

    const handleLogOut = () => {
        dispatch(logOut());
    }

    const handleOptionSelect = e => {
        if(e.target.value === 'Log Out') {
            handleLogOut();
        }
    }

    return (
        <div id='authenticated-search'>
            <select onChange={handleOptionSelect}>
                <option>
                    {user ? user.username : 'Loading...'}
                </option>
                <option>
                    Log Out
                </option>
            </select>
        </div>
    )
}

export default AuthenticatedSearch
