import { Navigate, Outlet } from 'react-router-dom';

import React from 'react'

const PrivateRoute = () => {
    // get userInfo
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // this just checks if a user is logged in, cause there's a state variable stored if they are
    return userInfo ? <Outlet /> : <Navigate to='/' replace />;
}

export default PrivateRoute