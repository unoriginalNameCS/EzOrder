import Header from "./components/Header";
import { Outlet, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/main.css';
import { UserContext } from './UserContext';
import { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation(); // get the current location

  // Check if the pathname is the root/home route
  const isRootRoute = location.pathname === "/";

  return (
    <>
      <UserContext.Provider value={{ loggedIn, setLoggedIn }}>
        {/* Conditionally render the Header */}
        {location.pathname !== "/" && <Header />}

        <ToastContainer />
        {/* Render Container only if it's not the root route */}
        {isRootRoute ? (
          <Outlet />
        ) : (
          <Container>
            <Outlet />
          </Container>
        )}
      </UserContext.Provider>
    </>
  );
}

export default App;
