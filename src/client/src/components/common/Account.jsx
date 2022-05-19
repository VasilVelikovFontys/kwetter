import React, {useEffect, useState} from 'react'
import {ADMIN_ROLE, DEMOTE, MODERATOR_ROLE, PROMOTE} from "../../constants";
import '../../styles/components/common/account.css';
import {useDispatch} from "react-redux";
import {deleteAccount, demoteAccount, promoteAccount} from "../../store/actions/accountActions";

const Account = props => {
    const {account, currentUser} = props;

    const dispatch = useDispatch();

    const viewerIsAdmin = currentUser.roles.indexOf(ADMIN_ROLE) > -1;
    const viewerIsModerator = currentUser.roles.indexOf(MODERATOR_ROLE) > -1;
    const accountIsModerator = account.roles.indexOf(MODERATOR_ROLE) > -1;

    const [styledRoles, setStyledRoles] = useState([]);
    const [action, setAction] = useState(PROMOTE);
    const [hasPrivileges, setHasPrivileges] = useState(false);

    const [actionActive, setActionActive] = useState(false);
    const [deletionActive, setDeletionActive] = useState(false);

    useEffect(() => {
        if (accountIsModerator) {
            setAction(DEMOTE);
        }

        if (viewerIsAdmin) {
            setHasPrivileges(true);
        }

        if (viewerIsModerator && !accountIsModerator) {
            setHasPrivileges(true);
        }

        const newRoles = account.roles.map(role => <span key={role} className='role'>{role}</span>);
        setStyledRoles(newRoles);
    }, [account]);

    const handleAction = () => {
        setDeletionActive(false);
        if (!actionActive) return setActionActive(true);
        setActionActive(false);

        switch (action) {
            case PROMOTE:
                dispatch(promoteAccount(account.id))
                    .then(() => {
                        //No action needed
                    });
                break;

            case DEMOTE:
                dispatch(demoteAccount(account.id))
                    .then(() => {
                        //No action needed
                    });
                break;
        }
    }

    const cancelAction = () => {
        setActionActive(false);
    }

    const handleDelete = () => {
        setActionActive(false);
        if (!deletionActive) return setDeletionActive(true);
        setDeletionActive(false);

        dispatch(deleteAccount(account.id))
            .then(() => {
                //No action needed
            });
    }

    const cancelDeletion = () => {
        setDeletionActive(false);
    }

    const displayButtons = () => {
        if (!hasPrivileges) return;
        return (
            <>
                <td className={`${action}`} onClick={handleAction}>{action}</td>
                <td className='delete' onClick={handleDelete}>Delete</td>
            </>
        )
    }

    const displayAlert = () => {
        if (actionActive) {
            return (
                <>
                    <td>Are you sure you want to {action.toLowerCase()} {account.username}?</td>
                    <td onClick={handleAction} className={`${action}`}>Yes</td>
                    <td onClick={cancelAction} className='cancel'>Cancel</td>
                </>
            )
        }

        if (deletionActive) {
            return (
                <>
                    <td>Are you sure you want to delete {account.username}?</td>
                    <td onClick={handleDelete} className='delete'>Yes</td>
                    <td onClick={cancelDeletion} className='cancel'>Cancel</td>
                </>
            )
        }
    }

    return (
        <tr className='account'>
            <td>{account.username}</td>
            <td>{account.email}</td>
            <td>{styledRoles}</td>
            {displayButtons()}
            {displayAlert()}
        </tr>
    )
}

export default Account;
