import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import React from 'react'

const PrivateRoute = () => {
    // get userInfo
    // const { userInfo } = useSelector((state) => state.auth);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // Note for future: we could potentially store type of user (customer, manager, kitchen staff etc) in userInfo, then check if they should be able to access a route
    
    // this just checks if a user is logged in, cause there's a state variable stored if they are
    return userInfo ? <Outlet /> : <Navigate to='login' replace />;
}

export default PrivateRoute