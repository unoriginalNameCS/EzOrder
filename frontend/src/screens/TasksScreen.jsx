import React from 'react'
import SideNav from '../components/SideNav'
import FormContainer from '../components/FormContainer'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


const TasksScreen = () => {
    const navigate = useNavigate()
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