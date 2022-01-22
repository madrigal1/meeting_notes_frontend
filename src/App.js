import React from 'react';

import { Routes, Route } from "react-router-dom";

import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import "./App.scss";

const App = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </div>
        </LocalizationProvider>
    );
};

export default App;
