import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getCookie from './StaffScreen.jsx'

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  async function update (name, email, password) {
    const response = await fetch('http://localhost:5000/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `${userInfo.token}`
      },
      body: JSON.stringify({
        name,
        email,
        password,
      })
    })
    const data = await response.json();
    
    // if successfully update
    if (response.status === 200) {
      toast.success('Successfully updated user profile details')
      let updatedUserInfo = JSON.parse(localStorage.getItem('userInfo'))
      updatedUserInfo.name = name;
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))
      
    } else {
      toast.error(data.message)
    }
  
  }
  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        update(name, email, password)
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (
    <FormContainer>
      <h1>Update Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>
          Update
        </Button>

      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;