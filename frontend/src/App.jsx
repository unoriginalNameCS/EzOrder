import Header from "./components/Header";
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/main.css'
import { UserContext } from './UserContext'
import { useState } from 'react' 

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  return (
  <>
    <UserContext.Provider value={{ loggedIn, setLoggedIn }} >
      <Header />
    
      <ToastContainer/>
      <Container>
       <Outlet />
      </Container>
      </UserContext.Provider>
  </>
 )
};

export default App;