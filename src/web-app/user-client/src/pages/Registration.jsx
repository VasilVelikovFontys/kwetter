import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {emailIsValid, passwordIsValid, passwordsMatch, usernameIsValid} from "../utils/validator";
import {register} from "../store/actions/authActions";
import {useDispatch, useSelector} from "react-redux";

const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {jwt, authError} = useSelector(state => state.auth);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUsernameChange = e => {
        setUsername(e.target.value);
    };

    const handleEmailChange = e => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = e => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = e => {
        setConfirmPassword(e.target.value);
    };

    const handleLogin = () => {
        if (!usernameIsValid(username)) return setError('Invalid username!');
        if (!emailIsValid(email)) return setError('Invalid email!');
        if (!passwordIsValid(password)) return setError('Invalid password!');
        if (!passwordsMatch(password, confirmPassword)) return setError('Passwords do not match!');

        setError(null);

        setLoading(true);
        dispatch(register(username, email, password))
            .then(() => setLoading(false))
            .catch((error) => {
                setLoading(false);

                if (error.message) return setError(error.message)
                setError(error);
            });
    };

    const redirectToLogin = () => {
        navigate('/login');
    };

    useEffect(() => {
        if (jwt) return navigate('/start');
    }, [jwt]);

    useEffect(() => {
        if (authError) return setError(authError);
    }, [authError]);

    useEffect(() => {
        setError('');
    }, []);

    return (
        <div className='auth-page'>
            <div className={'auth-header'}>
                Registration
            </div>
            <form>
                <input name={'username'}
                       value={username}
                       placeholder={'Username'}
                       autoComplete='username'
                       onChange={handleUsernameChange}
                />

                <input name={'email'}
                       value={email}
                       placeholder={'E-mail'}
                       autoComplete='email'
                       onChange={handleEmailChange}
                />

                <input type={'password'}
                       value={password}
                       name={'password'}
                       placeholder={'Password'}
                       autoComplete='current-password'
                       onChange={handlePasswordChange}
                />

                <input type={'password'}
                       value={confirmPassword}
                       name={'confirm-password'}
                       placeholder={'Confirm Password'}
                       autoComplete='confirm-password'
                       onChange={handleConfirmPasswordChange}
                />

                {loading && (
                    <div className='auth-loading'>
                        Loading...
                    </div>
                )}

                {error && (
                    <div className='auth-error'>
                        {error}
                    </div>
                )}
            </form>

            <div className='auth-form-button'
                 onClick={handleLogin}
            >
                Sign Up
            </div>

            <div className='auth-redirect-link'
                 onClick={redirectToLogin}
            >
                Already have an account?
            </div>
        </div>
    );
}

export default Registration;
