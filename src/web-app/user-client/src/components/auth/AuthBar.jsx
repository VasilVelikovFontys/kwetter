import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/authBar.css";
import {useDispatch, useSelector} from "react-redux";

const AuthBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.user);

    const handleLoginButton = () => {
        navigate('/login');
    };

    return (
        <>
            {user ?
                <div>Logged in {user.username}</div>
                :
                <div className='login-button' onClick={handleLoginButton}>
                    Login
                </div>
            }
        </>
    )
}

export default AuthBar;
