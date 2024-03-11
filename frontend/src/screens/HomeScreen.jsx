import React from 'react'
import Hero from '../components/Hero'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav.jsx'
import FormContainer from '../components/FormContainer.jsx'

// just doing manager home screen for now, just basics
const HomeScreen = () => {

  const userInfo = localStorage.getItem('userInfo')
  const navigate = useNavigate();


  return (
    <>
      { userInfo ? <> <SideNav /> {/* make a manager/staff dashboard and import it here */} </> : 
      <> 
      <FormContainer>
      <div>
        Welcome to EzOrder <br /> 
        Order quick, order easy
        <br /> <br />
        <Button 
          variant='contained'
          color='primary'
          sx={{margin: 1}}
          onClick={() => {navigate('/login')}}>
            Sign In
        </Button>
        <br /> <br />
        <Button 
          variant='outlined'
          color='primary'
          sx={{margin: 1}}
          onClick={() => {navigate('/register')}}>
          Sign Up
        </Button>
        </div>
        </FormContainer>
      </>
      }
    </>
  )
}

export default HomeScreen