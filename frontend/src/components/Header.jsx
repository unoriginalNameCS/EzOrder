import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaHandPaper } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";

const Header = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { loggedIn, setLoggedIn } = useContext(UserContext);
  const [newRequests, setNewRequests] = useState([]);

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
    const response = await fetch(
      `http://localhost:5000/tables/${userInfo.restaurant}/assistance`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const data = await response.json();

    // if 200 there is data, there is customer requests pending
    if (response.status === 200) {
      setNewRequests(data);
    } else if (response.status === 204) {
      // if 204, then no content (there is no customer requests pending)
      console.log("No Content 204", data);
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
        }, 5000);
        return () => {
          clearInterval(interval);
        };
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
                          <FaHandPaper style={newRequests.length > 0 ? {color: "red"} : {}} />
                          Table Requests
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
