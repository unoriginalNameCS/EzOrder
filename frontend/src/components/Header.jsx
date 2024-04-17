import { useContext, useEffect, useState } from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { FaHandPaper, FaSignInAlt, FaSignOutAlt, FaUtensils } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { loggedIn, setLoggedIn } = useContext(UserContext);
  const [requestList, setRequestList] = useState([]);
  const [orderList, setOrderList] = useState([]);

  const logoutHandler = async () => {
    const response = await fetch("http://localhost:5000/api/users/logout", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      localStorage.removeItem("userInfo");
      toast.success(data.message);
      navigate("/login");
      setLoggedIn(!loggedIn);
    } else {
      toast.error(data.message);
    }
  };

  async function getTableRequests() {
    try {
      const baseUrl = `http://localhost:5000/requests/${userInfo.restaurant}/requests`;
  
      // Fetch all orders concurrently with different query parameters
      const [pendingResponse, inProgressResponse] = await Promise.all([
        axios.get(baseUrl, { params: { state: 'waiting' } }),
        axios.get(baseUrl, { params: { state: 'assisting' } }),
      ]);
      setRequestList([...pendingResponse.data, ...inProgressResponse.data]);

    } catch (error) {
      console.error('There was an error fetching the orders:', error.response?.data || error.message);
    }
  }

  async function getOrdersToServe() {
    try {
      const baseUrl = `http://localhost:5000/orders/${userInfo.restaurant}/orders`;
  
      // Fetch all orders concurrently with different query parameters
      const [pendingResponse, preparingResponse] = await Promise.all([
        axios.get(baseUrl, { params: { state: 'serve' } }),
        axios.get(baseUrl, { params: { state: 'serving' } }),
      ]);
      setOrderList([...pendingResponse.data, ...preparingResponse.data]);

    } catch (error) {
      console.error('There was an error fetching the orders:', error.response?.data || error.message);
    }
  }

  // if role === wait staff, then get customer table requests
  useEffect(() => {
    if (!userInfo) {
      return
    }
    if (userInfo.role === "wait staff") {
        const interval = setInterval(() => {
          getTableRequests();
          getOrdersToServe();
        }, 5000);
        return () => {
          clearInterval(interval);
        };
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!userInfo) {
      return
    }
    if (userInfo.role === "wait staff") {
      getTableRequests();
      getOrdersToServe();
    }
  }, [loggedIn]);

  return (
    <header>
      <Navbar
        bg="light"
        variant="light"
        expand="lg"
        collapseOnSelect
        fixed="top"
        sticky="top"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>EzOrder</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                <>
                  { /* if userInfo.role === wait staff then show */}
                  {userInfo.role === "wait staff" && (
                    <>
                      <LinkContainer to="/table/assistance">
                        <Nav.Link>
                          {/* If pending requests is greater than 0 then make the colour red */}
                          <FaHandPaper style={requestList.length > 0 ? {color: "red"} : {}} />
                          Table Requests
                        </Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/readyToServeOrders">
                        <Nav.Link>
                          {/* If pending requests is greater than 0 then make the colour red */}
                          <FaUtensils style={orderList.length > 0 ? {color: "red"} : {}} />
                          Orders Ready
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  )}
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
