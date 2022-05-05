import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Profile from "../pages/Profile";
import Start from "../pages/Start";
import {useDispatch, useSelector} from "react-redux";
import {getJwtFromLocalStorage, verifyJwt} from "../store/actions/authActions";
import Accounts from "../pages/Accounts";
import {ADMIN_ROLE, MODERATOR_ROLE} from "../constants";

const App = () => {
    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);
    const {user} = useSelector(state => state.currentUser);

    useEffect(() => {
        dispatch(getJwtFromLocalStorage());
    }, []);

    useEffect(() => {
        if (jwt) {
            dispatch(verifyJwt());
        }
    }, [jwt]);

    const auth = jwt && user;

    const isAdmin = auth && user.roles.indexOf(ADMIN_ROLE) > -1;
    const isModerator = auth && user.roles.indexOf(MODERATOR_ROLE) > -1;
    const isUser = auth && user.roles.indexOf(ADMIN_ROLE) < 0 && user.roles.indexOf(MODERATOR_ROLE) < 0;

    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route
                        path='/login'
                        element={<Login/>}
                    />
                    <Route
                        path='/register'
                        element={<Registration/>}
                    />
                    {(isUser || isModerator) && (
                        <Route
                            path='/start'
                            element={<Start/>}
                        />
                    )}
                    {(isUser || isModerator) && (
                        <Route
                            path='/profile'
                            element={<Profile/>}
                        />
                    )}
                    {(isAdmin || isModerator) && (
                        <Route
                            path='/accounts'
                            element={<Accounts/>}
                        />
                    )}
                    <Route
                        exact
                        path='*'
                        element={<Login/>}
                    />
                  </Routes>
              </div>
        </BrowserRouter>
  )
}

export default App
