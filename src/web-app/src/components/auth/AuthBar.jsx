import React, {useEffect, useState} from "react";
import "../../styles/components/auth/authBar.css";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser} from "../../store/actions/userActions";
import LoginButton from "./LoginButton";
import AuthenticatedSearch from "./AuthenticatedSearch";

const AuthBar = () => {
    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);

    const [error, setError] = useState('');

    useEffect(() => {
        if(jwt) {
            dispatch(getCurrentUser())
                .then(() => {
                    //No need for action
                })
                .catch((userError) => {
                    if (userError.message) return setError(userError.message)
                    setError(userError);
                });
        }
    }, [dispatch, jwt]);

    return (
        <div id='auth-bar'>
            {jwt && (
                <AuthenticatedSearch/>
            )}

            {!jwt && !error && (
                <LoginButton />
            )}

            {error && (
                <span>{error}</span>
            )}
        </div>
    )
}

export default AuthBar;
