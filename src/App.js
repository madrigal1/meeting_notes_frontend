import React from 'react';

import { Routes, Route, Navigate } from "react-router-dom";

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import "./App.scss";


const App = () => {
    const isLoggedIn = () => (localStorage.getItem("profile") !== null);

    console.log(isLoggedIn());
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </LocalizationProvider>
    );
};

export default App;
