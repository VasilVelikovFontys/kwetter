import React from "react";
import '../../styles/components/auth/loginButton.css';
import {useNavigate} from "react-router-dom";

const LoginButton = () => {
    const navigate = useNavigate();

    const handleLoginButton = () => {
        navigate('/login');
    };

    return (
        <div id='login-button' onClick={handleLoginButton}>
            Login
        </div>
    )
}

export default LoginButton
