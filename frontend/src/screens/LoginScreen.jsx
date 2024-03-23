import React from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormContainer from '../components/FormContainer'
import { UserContext } from '../UserContext';
import { useContext } from 'react'


const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate();
  const {loggedIn, setLoggedIn} = useContext(UserContext)


  async function signin (email, password) {
    const response = await fetch('http://localhost:5000/api/users/auth', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    })
    const data = await response.json();
    // store info in localStorage

    // if successful signIn then navigate to dashboard
    if (response.status === 200) {
      localStorage.setItem('userInfo', JSON.stringify(data))
      toast.success('Successfully signed in')
      navigate('/')
      setLoggedIn(true)
    } else {
      toast.error(data?.message)
      console.log(data?.message);

    }

  }

  const submitHandler = () => {
    signin(email, password)
  }

  return (
    <>
    <FormContainer>
      <h2>Login</h2>
      <br />
      <TextField
        required
        label='email'
        onChange={(e) => setEmail(e.target.value)}
        sx={{margin: 1}}
      />
      <br />
      <TextField
        type='password'
        required
        label='password'
        sx={{margin: 1}}
        onChange={(e) => setPassword(e.target.value)}
      >
        Password
      </TextField>
      <br />
      <Button
      variant='contained'
      color='primary'
      sx={{margin: 1}}
      onClick={submitHandler}>
        Login
      </Button>
      <br />
      Don't have an account?
      <Button
      variant='contained'
      color='primary'
      sx={{margin: 1}}
      onClick={() => {navigate('/register')}}>
        Register now
      </Button>
      </FormContainer>
    </>
  )
}

export default Login