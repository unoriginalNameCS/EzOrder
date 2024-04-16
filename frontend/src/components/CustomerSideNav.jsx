import React from "react";
import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

import { FiSettings } from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BiFoodMenu } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";

import EzOrderLogo from "./assets/EzOrder.svg";

const SideNav = () => {
  const restaurantInfo = JSON.parse(localStorage.getItem("restaurantInfo"));

  const textStyle = {
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "normal",
  };

  const iconStyle = {
    width: "3rem",
    height: "3rem",
    padding: "0.75rem",
    marginRight: "0.75rem",
  };

  return (
    <Sidebar
      rootStyles={{
        backgroundColor: "#FDFDFD",
        height: "100vh",
        position: "fixed",
        left: "0",
        top: "0",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={restaurantInfo.logoUrl ? restaurantInfo.logoUrl : EzOrderLogo}
          alt="Logo"
          style={{ maxWidth: "150px", marginTop: "2rem", marginBottom: "1rem" }}
        />
      </div>
      <Menu
        menuItemStyles={{
          button: {
            [`&.active`]: {
              backgroundColor: "#13395e",
              color: "#b6c8d9",
            },
          },
        }}
      >
        <MenuItem component={<Link to="/orders" />}>
          <HiOutlineClipboardList style={iconStyle} />
          <span style={textStyle}>MY ORDERS</span>
        </MenuItem>
        <MenuItem component={<Link to="/customermenu" />}>
          <BiFoodMenu style={iconStyle} />
          <span style={textStyle}>MENU</span>
        </MenuItem>
        <MenuItem component={<Link to="/cart" />}>
          <AiOutlineUser style={iconStyle} />
          <span style={textStyle}>CART</span>
        </MenuItem>
      </Menu>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          marginTop: '20rem',
        }}
      >
        <img
          src={restaurantInfo.bannerUrl ? restaurantInfo.bannerUrl : EzOrderLogo}
          alt="Banner"
          style={{ minWidth: "100%", objectFit: 'cover'}}
        />
      </div>
    </Sidebar>
  );
};

export default SideNav;
