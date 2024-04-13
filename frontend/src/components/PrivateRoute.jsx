import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import React from 'react'

const PrivateRoute = () => {
    // get userInfo
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // this just checks if a user is logged in, cause there's a state variable stored if they are
    return userInfo ? <Outlet /> : <Navigate to='login' replace />;
}

export default PrivateRoute