import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {getAccounts} from "../store/actions/accountActions";
import Account from "../components/common/Account";
import '../styles/pages/accounts.css';
import {useNavigate} from "react-router-dom";
import {logOut} from "../store/actions/authActions";

const Accounts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user: currentUser} = useSelector(state => state.currentUser);

    const {accounts, loading: accountsLoading, error: accountsError} = useSelector(state => state.accounts);

    const [styledAccounts, setStyledAccounts] = useState([]);

    useEffect(() => {
        dispatch(getAccounts())
            .then(() => {
                //No action needed
            });
    }, []);

    useEffect(() => {
        if(!accounts) return;
        const newAccounts = accounts.map(account => <Account key={account.email} account={account} currentUser={currentUser}/>);

        setStyledAccounts(newAccounts);
    }, [accounts]);

    const handleLogout = () => {
        dispatch(logOut());
    }

    const redirectToStart = () => {
        navigate('/start');
    }

    const displayAccounts = () => {
        if (accountsLoading) return <div>Loading...</div>
        if (styledAccounts.length === 0) return <div>No accounts</div>
        return (
            <table id='accounts-table'>
                <tbody>
                    <tr>
                        <td>Username</td>
                        <td>Email</td>
                        <td>Roles</td>
                    </tr>
                    {styledAccounts}
                </tbody>
            </table>
        )
    }

    return (
        <div id='accounts-page'>
            <div id='accounts-nav'>
                <div>Accounts</div>
                <div id='accounts-nav-buttons'>
                    {currentUser && currentUser.roles.indexOf('ADMIN') < 0 && (
                        <div id='start-button' onClick={redirectToStart}>Start</div>
                    )}
                    <div id='logout-button' onClick={handleLogout}>Log out</div>
                </div>
            </div>

            {displayAccounts()}

            {accountsError && (
                <div className='accounts-error'>{accountsError}</div>
            )}
        </div>
    )
}

export default Accounts;
