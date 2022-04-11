import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {emailIsValid, nameIsValid, passwordIsValid, passwordsMatch, usernameIsValid} from "../utils/validator";
import {register} from "../store/actions/authActions";
import {useDispatch, useSelector} from "react-redux";

const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {jwt, authError} = useSelector(state => state.auth);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFirstNameChange = e => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = e => {
        setLastName(e.target.value);
    };

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
        if (!nameIsValid(firstName)) return setError('Invalid first name!');
        if (!nameIsValid(lastName)) return setError('Invalid last name!');
        if (!usernameIsValid(username)) return setError('Invalid username!');
        if (!emailIsValid(email)) return setError('Invalid email!');
        if (!passwordIsValid(password)) return setError('Invalid password!');
        if (!passwordsMatch(password, confirmPassword)) return setError('Passwords do not match!');

        setError(null);

        setLoading(true);
        dispatch(register({firstName, lastName, username, email, password}))
            .then(() => setLoading(false))
            .catch((registerError) => {
                setLoading(false);

                if (registerError.message) return setError(registerError.message)
                setError(registerError);
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
                       value={firstName}
                       placeholder={'Username'}
                       autoComplete='first-name'
                       onChange={handleFirstNameChange}
                       name='first-name'
                />

                <input className='auth-input'
                       value={lastName}
                       placeholder={'Last Name'}
                       autoComplete='last-name'
                       onChange={handleLastNameChange}
                       name='last-name'
                />

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
