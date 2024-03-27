import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { FiSettings } from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BiFoodMenu } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";

import EzOrderLogo from "./assets/EzOrder.svg"



const SideNav = () => {

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

  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const isCustomer = !!customerInfo;

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
        {isCustomer ? 
        (<MenuItem component={<Link to="/orders" />}> 
          <HiOutlineClipboardList style={iconStyle}/>
          <span style={textStyle}> MY ORDERS</span>
        </MenuItem>) :
        <MenuItem component={<Link to="/orders" />}> 
          <HiOutlineClipboardList style={iconStyle}/>
          <span style={textStyle}>ORDERS</span>
        </MenuItem>}

        {isCustomer ?
        <MenuItem component={<Link to="/customermenu" />}> 
          <BiFoodMenu style={iconStyle}/>
          <span style={textStyle}>MENU</span>
        </MenuItem> :
        <MenuItem component={<Link to="/menu" />}> 
          <BiFoodMenu style={iconStyle}/>
          <span style={textStyle}>MENU</span>
        </MenuItem>}
        
        {!isCustomer && 
        <MenuItem component={<Link to="/staff" />}>
          <AiOutlineUser style={iconStyle}/>
          <span style={textStyle}>STAFF</span>
        </MenuItem>}
        {!isCustomer && 
        <MenuItem component={<Link to="/settings" />}>
          <FiSettings style={iconStyle}/>
          <span style={textStyle}>SETTINGS</span>
        </MenuItem>}
      </Menu>
    </Sidebar>
  ) 
};

export default SideNav;