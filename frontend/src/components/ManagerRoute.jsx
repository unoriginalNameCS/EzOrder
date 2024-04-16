import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ManagerRoute = () => {
    // get userInfo
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const role = userInfo.role === 'manager' ? true : false
    return role ? <Outlet /> : <Navigate to='/' replace />;
}

export default ManagerRoute