import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { FiSettings } from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BiFoodMenu } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";




const SideNav = () => {

  const iconStyle = {
    width: '3rem',
    height: '3rem',
    padding: '0.75rem'
  };

  return (
    <Sidebar
      rootStyles={{
          backgroundColor: '#FDFDFD',
          height: '100vh'
      }}
    >
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
        <MenuItem component={<Link to="/orders" />}> 
          <HiOutlineClipboardList style={iconStyle}/>
          Orders
        </MenuItem>
        <MenuItem component={<Link to="/menu" />}> 
          <BiFoodMenu style={iconStyle}/>
          Menu
        </MenuItem>
        <MenuItem component={<Link to="/staff" />}>
          <AiOutlineUser style={iconStyle}/>
          Staff
        </MenuItem>
        <MenuItem component={<Link to="/settings" />}>
          <FiSettings style={iconStyle}/>
          Settings
        </MenuItem>
      </Menu>
    </Sidebar>
  ) 
};

export default SideNav;