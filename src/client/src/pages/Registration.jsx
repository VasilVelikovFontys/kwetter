import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {emailIsValid, passwordIsValid, passwordsMatch, usernameIsValid} from "../utils/validator";
import {register} from "../store/actions/authActions";
import {useDispatch, useSelector} from "react-redux";
import {SET_AUTH, SET_CURRENT_USER} from "../constants";

const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {jwt, loading: authLoading, error: authError} = useSelector(state => state.auth);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

        dispatch({type: SET_AUTH, jwt: null});
        dispatch({type: SET_CURRENT_USER, user: null});

        dispatch(register({username, email, password}))
            .then(() => {
                //No action needed
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
                <input className='auth-input'
                       value={username}
                       placeholder={'Username'}
                       autoComplete='username'
                       onChange={handleUsernameChange}
                       name='username'
                />

                <input className='auth-input'
                       value={email}
                       placeholder={'E-mail'}
                       autoComplete='email'
                       onChange={handleEmailChange}
                       name='email'
                />

                <input className='auth-input'
                       type={'password'}
                       value={password}
                       placeholder={'Password'}
                       autoComplete='current-password'
                       onChange={handlePasswordChange}
                       name='password'
                />

                <input className='auth-input'
                       type={'password'}
                       value={confirmPassword}
                       placeholder={'Confirm Password'}
                       autoComplete='confirm-password'
                       onChange={handleConfirmPasswordChange}
                       name='password'
                />

                {authLoading && (
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
