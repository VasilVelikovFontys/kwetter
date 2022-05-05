import React from "react";
import "../../styles/components/auth/authBar.css";
import {useSelector} from "react-redux";
import LoginButton from "./LoginButton";
import AuthenticatedSearch from "./AuthenticatedSearch";

const AuthBar = () => {
    const {jwt} = useSelector(state => state.auth);

    return (
        <div id='auth-bar'>
            {jwt && (
                <AuthenticatedSearch/>
            )}

            {!jwt && (
                <LoginButton />
            )}
        </div>
    )
}

export default AuthBar;
