import React, { useState } from 'react';
import Header from "./components/Header";
import { Outlet, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/main.css';
import { UserContext } from './UserContext';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation(); // Get the current location
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Check for login/register routes or if the user is logged in
  const showHeader = ['/login', '/register'].includes(location.pathname) || loggedIn || userInfo;

  // Check if the pathname is NOT the root/home or customer route
  const showContainer = !['/', '/customer'].includes(location.pathname);

  return (
    <>
      <UserContext.Provider value={{ loggedIn, setLoggedIn }}>
        {/* Render Header based on condition */}
        {showHeader && <Header />}

        <ToastContainer />

        {/* Render Container based on condition */}
        {showContainer ? (
          <Container>
            <Outlet />
          </Container>
        ) : (
          <Outlet />
        )}
      </UserContext.Provider>
    </>
  );
}

export default App;
