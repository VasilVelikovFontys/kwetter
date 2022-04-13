import React, {useEffect, useState} from 'react';
import '../styles/pages/auth.css';
import {useNavigate} from "react-router-dom";
import {emailIsValid, passwordIsValid} from "../utils/validator";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../store/actions/authActions";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {jwt, loading: authLoading, error: authError} = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const handleEmailChange = e => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = e => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        if (!emailIsValid(email)) return setError('Invalid email!');
        if (!passwordIsValid(password)) return setError('Invalid password!');

        setError(null);

        dispatch(login({email, password}))
            .then(() => {
                //No action needed
            })
            .catch((loginError) => {
                if (loginError.message) return setError(loginError.message)
                setError(loginError);
            });
    };

    const redirectToRegister = () => {
        navigate('/register');
    }

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
                Login
            </div>
            <form>
                <input value={email}
                       placeholder='E-mail'
                       autoComplete='email'
                       onChange={handleEmailChange}
                       className='auth-input'
                       name='email'
                />

                <input type='password'
                       value={password}
                       placeholder='Password'
                       autoComplete='current-password'
                       onChange={handlePasswordChange}
                       className='auth-input'
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
                Log In
            </div>

            <div className='auth-redirect-link'
                 onClick={redirectToRegister}
            >
                Don't have an account?
            </div>
        </div>
    );
};

export default Login;