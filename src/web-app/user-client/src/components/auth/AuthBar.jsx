import React, {useEffect} from "react";
import "../../styles/components/auth/authBar.css";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser} from "../../store/actions/userActions";
import LoginButton from "./LoginButton";
import AuthenticatedSearch from "./AuthenticatedSearch";

const AuthBar = () => {
    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);

    useEffect(() => {
        if(jwt) {
            dispatch(getCurrentUser());
        }
    }, [dispatch, jwt]);

    return (
        <div id='auth-bar'>
            {jwt ?
                <AuthenticatedSearch/>
                :
                <LoginButton />
            }
        </div>
    )
}

export default AuthBar;
