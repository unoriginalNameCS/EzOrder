import React, { useEffect } from 'react'
import SideNav from '../components/SideNav'
import FormContainer from '../components/FormContainer'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const TasksScreen = () => {
    const navigate = useNavigate()
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    async function getTableRequests () {
      const response = await fetch(`http://localhost:5000/tables/${userInfo.restaurant}/assistance`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
      await response.json();
    }

    // if role === staff, then get customer table requests
    // @TODO will need to be adjusted to wait staff
    
    
    useEffect(() => {
      getTableRequests()
    }, [])
    

  return (
    <>
        <SideNav />
        <FormContainer>
            <h2>Tasks</h2>
            
            <Button
            variant='contained'
            color='primary'
            sx={{margin: 1}}
            onClick={() => navigate('/')}>
                Back to home
            </Button>
        </FormContainer>
    </>

  )
}

export default TasksScreen