import React from "react";
import "../../styles/components/auth/authBar.css";
import {useSelector} from "react-redux";
import LoginButton from "./LoginButton";
import AuthenticatedSearch from "./AuthenticatedSearch";

const AuthBar = props => {
    const {jwt} = useSelector(state => state.auth);
    const {setSelectedTab} = props;

    return (
        <div id='auth-bar'>
            {jwt && (
                <AuthenticatedSearch setSelectedTab={setSelectedTab}/>
            )}

            {!jwt && (
                <LoginButton />
            )}
        </div>
    )
}

export default AuthBar;
