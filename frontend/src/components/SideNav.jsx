import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { FiSettings } from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BiFoodMenu } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { MdTableRestaurant } from "react-icons/md";

import axios from 'axios';
import { FaHandPaper, FaSignInAlt, FaSignOutAlt, FaUtensils } from "react-icons/fa";


import EzOrderLogo from "./assets/EzOrder.svg"

const SideNav = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isKitchenStaff = userInfo.role === 'kitchen staff';
  const isManager = userInfo.role === 'manager';

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
        {(isKitchenStaff || isManager) && (<MenuItem component={<Link to="/kitchen" />}> 
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
        {isManager && (<MenuItem component={<Link to="/tableEdits" />}>
          <MdTableRestaurant style={iconStyle}/>
          <span style={textStyle}>TABLES</span>
        </MenuItem>)}
        {isManager && (<MenuItem component={<Link to="/settings" />}>
          <FiSettings style={iconStyle}/>
          <span style={textStyle}>SETTINGS</span>
        </MenuItem>)}
      </Menu>
    </Sidebar>
  )
};

export default SideNav;