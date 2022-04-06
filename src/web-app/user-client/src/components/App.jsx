import React, {useEffect} from 'react';
import '../styles/App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Profile from "../pages/Profile";
import Start from "../pages/Start";
import {useDispatch, useSelector} from "react-redux";
import {getJwtFromLocalStorage, verifyJwt} from "../store/actions/authActions";

const App = () => {
    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getJwtFromLocalStorage());
    }, []);

    useEffect(() => {
        if (jwt) {
            dispatch(verifyJwt());
        }
    }, [jwt]);

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
                    <Route
                        path='/start'
                        element={<Start/>}
                    />
                    <Route
                        path='/profile'
                        element={<Profile/>}
                    />
                    <Route
                        exact
                        path='/'
                        element={<Profile/>}
                    />
                  </Routes>
              </div>
        </BrowserRouter>
  )
}

export default App
