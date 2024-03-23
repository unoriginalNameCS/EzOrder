import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt, FaHandPaper } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';


const Header = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const {loggedIn, setLoggedIn} = useContext(UserContext)

  const logoutHandler = async () => {
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      })
      const data = await response.json();
      if (response.status === 200) {
        localStorage.removeItem('userInfo')
        toast.success(data.message)
        navigate('/login')
        setLoggedIn(false)
        console.log(loggedIn)
      } else {
        toast.error(data.message)
      }
  }

  async function getTableRequests () {
      console.log('userInfo.restaurant', userInfo.restaurant)
      const response = await fetch(`http://localhost:5000/tables/${userInfo.restaurant}/assistance`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
      const data = await response.json();
  
      // if 200 there is data, there is customer requests pending
      if (response.status === 200) {
        console.log('200 Success',data)
      } else if (response.status === 204) {
        // if 204, then no content (there is no customer requests pending)
        console.log('204', data)
      }
    }

    // if role === staff, then get customer table requests
    // @TODO will need to be adjusted to wait staff
    useEffect(() => {
      if (userInfo) {
        if (userInfo.role === 'staff') {
          const interval = setInterval(() => {
            getTableRequests();
          }, 3000);
          return () => {
            clearInterval(interval);
          };
        }
      }
    }, [loggedIn])
  return (
    <header>
      <Navbar bg='light' variant='light' expand='lg' collapseOnSelect fixed='top' sticky='top'>
        <Container>
          <LinkContainer to='/'>
          <Navbar.Brand>EzOrder</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              { userInfo ? (
                <>  {/* @TODO: will need to be changed to 'wait staff' whenever backend is fixed for registering staff */}
                  { userInfo.role === 'staff' &&
                  <>
                    <LinkContainer to='/table/assistance'>
                    <Nav.Link>
                      <FaHandPaper /> Table Requests
                    </Nav.Link>
                    </LinkContainer>

                  </>
                  }
                  <NavDropdown title={userInfo.name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>
                        Profile 
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                  
                </>
              ) : (
                <>
              <LinkContainer to='/login'>
                <Nav.Link>
                  <FaSignInAlt /> Sign In
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to='/register'>
                <Nav.Link>
                  <FaSignOutAlt /> Sign Up
                </Nav.Link>
              </LinkContainer>
                </>
              ) }
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;