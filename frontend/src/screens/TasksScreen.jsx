import React, { useEffect } from 'react'
import SideNav from '../components/SideNav'
import FormContainer from '../components/FormContainer'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import WaitStaffTasks from './WaitStaffTasks';


const TasksScreen = () => {
    const navigate = useNavigate()
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
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