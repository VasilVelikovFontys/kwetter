import React  from 'react';
import '../styles/App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Login from "./auth/Login";
import Register from "./auth/Register";
import Profile from "./profile/Profile";
import Start from "./start/Start";

const App = () => {
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
                      element={<Register/>}
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
