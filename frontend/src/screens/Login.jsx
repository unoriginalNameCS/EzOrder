import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'


const Login = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate();

  async function signin (email, password) {
    console.log(`Email : ${email}, Password: ${password}`)
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
    localStorage.setItem('userInfo', JSON.stringify(data))
    
    // if successful signIn then navigate to dashboard
    if (response.status === 200) {
      toast.success('Successfully signed in')
      navigate('/')
    }
  
  }

  const submitHandler = () => {
    //console.log(email, password)
    signin(email, password)
  }

  
  return (
    <>
      <div>Login</div>
      <input type="text"
        placeholder='email'
        aria-label='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input type="password" 
      placeholder='password'
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      />
      <br /> <br />
      <button type='submit'
              onClick={submitHandler}
      >Submit</button>
    </>
  )
}

export default Login