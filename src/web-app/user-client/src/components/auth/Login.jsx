import React, {useState} from 'react';
import '../../styles/auth/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className='page'>
            <div className={'header'}>
                Login
            </div>
        </div>
    )
}

export default Login;
