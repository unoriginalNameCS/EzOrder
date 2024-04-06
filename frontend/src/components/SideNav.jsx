import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { FiSettings } from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BiFoodMenu } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import axios from 'axios';
import { FaHandPaper, FaSignInAlt, FaSignOutAlt, FaUtensils } from "react-icons/fa";


import EzOrderLogo from "./assets/EzOrder.svg"

const SideNav = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isKitchenStaff = userInfo.role === 'kitchen staff';
  const isManager = userInfo.role === 'manager';
  // const isWaiter = userInfo.role === 'wait staff';

  // const [requestList, setRequestList] = useState([]);
  // const [orderList, setOrderList] = useState([]);

  // async function getTableRequests() {
  //   try {
  //     const baseUrl = `http://localhost:5000/requests/${userInfo.restaurant}/requests`;
  
  //     // Fetch all orders concurrently with different query parameters
  //     const [pendingResponse, inProgressResponse] = await Promise.all([
  //       axios.get(baseUrl, { params: { state: 'waiting' } }),
  //       axios.get(baseUrl, { params: { state: 'assisting' } }),
  //     ]);
  //     console.log(pendingResponse.data);
  //     setRequestList([...pendingResponse.data, ...inProgressResponse.data]);

  //   } catch (error) {
  //     console.error('There was an error fetching the orders:', error.response?.data || error.message);
  //   }
  // }

  // async function getOrdersToServe() {
  //   try {
  //     const baseUrl = `http://localhost:5000/orders/${userInfo.restaurant}/orders`;
  
  //     // Fetch all orders concurrently with different query parameters
  //     const [pendingResponse, preparingResponse] = await Promise.all([
  //       axios.get(baseUrl, { params: { state: 'serve' } }),
  //       axios.get(baseUrl, { params: { state: 'serving' } }),
  //     ]);
  //     console.log(pendingResponse.data);
  //     setOrderList([...pendingResponse.data, ...preparingResponse.data]);

  //   } catch (error) {
  //     console.error('There was an error fetching the orders:', error.response?.data || error.message);
  //   }
  // }

  const textStyle = {
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 'normal'
  };

  const iconStyle = {
    width: '3rem',
    height: '3rem',
    padding: '0.75rem',
    marginRight: '0.75rem'
  };

  return (
    <Sidebar
      rootStyles={{
          backgroundColor: '#FDFDFD',
          height: '100vh',
          position: 'fixed',
          left: '0',
          top: '0'
      }}
    >
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <img src={EzOrderLogo} alt="EzOrderLogo" style={{ width: '100%', maxWidth: '150px', marginTop: '2rem'}} /> {/* Adjust the size as needed */}
    </div>
      <Menu
        menuItemStyles={{
          button: {
            [`&.active`]: {
              backgroundColor: '#13395e',
              color: '#b6c8d9',
            },
          },
        }}
      >
        {isKitchenStaff && (<MenuItem component={<Link to="/kitchen" />}> 
          <HiOutlineClipboardList style={iconStyle}/>
          <span style={textStyle}>KITCHEN</span>
        </MenuItem>)}
        <MenuItem component={<Link to="/menu" />}> 
          <BiFoodMenu style={iconStyle}/>
          <span style={textStyle}>MENU</span>
        </MenuItem>
        {isManager && (<MenuItem component={<Link to="/staff" />}>
          <AiOutlineUser style={iconStyle}/>
          <span style={textStyle}>STAFF</span>
        </MenuItem>)}
        {isManager && (<MenuItem component={<Link to="/settings" />}>
          <FiSettings style={iconStyle}/>
          <span style={textStyle}>SETTINGS</span>
        </MenuItem>)}
        {/* {isWaiter && (<MenuItem component={<Link to="/table/assistance" />}>
          <FaHandPaper style={iconStyle} />
          <span style={textStyle}>REQUESTS</span>
        </MenuItem>)}
        {isWaiter && (<MenuItem component={<Link to="/readyToServeOrders" />}>
          <FaUtensils style={iconStyle}/>
          <span style={textStyle}>ORDERS</span>
        </MenuItem>)} */}
      </Menu>
    </Sidebar>
  ) 
};

export default SideNav;