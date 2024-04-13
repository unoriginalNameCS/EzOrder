import React, { useEffect } from 'react'
import SideNav from '../components/SideNav.jsx'
import FormContainer from '../components/FormContainer.jsx'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';



const EmployeeHomeScreen = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const navigate = useNavigate()
  const [restaurantName, setRestaurantName] = React.useState('')

  async function getRestaurantInfo () {
    const response = await fetch('http://localhost:5000/api/users/restaurant', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `${userInfo.token}`,
      },
    })
    const data = await response.json();
    setRestaurantName(data.name)
    // add restaurantName to userInfo
    let updatedUserInfo = JSON.parse(localStorage.getItem('userInfo'))
      updatedUserInfo.restaurantName = data.name;
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))
  }

  // This is fetching restaurantInfo whenever user goes to homepage, when logged in
  useEffect(() => {
    getRestaurantInfo()
  }, [])

  return (
    <>
      <SideNav />
      <FormContainer>
        <h3>Welcome to your dashboard</h3>
        Restaurant: {restaurantName} <br />
        Role: {userInfo.role}

        {userInfo.role === 'staff' ? <> 
        <Button 
          variant='contained'
          color='primary'
          sx={{margin: 1}}
          onClick={() => navigate('/tasks')}>
          Your Tasks
        </Button> 
        </> : <>
        <Button 
          variant='contained'
          color='primary'
          sx={{marginTop: 3}}
          onClick={() => navigate('/tasks')}>
          Assign Tasks to your staff from here
        </Button>
        </>}
        

      </FormContainer>
    </>
  )
}

export default EmployeeHomeScreen