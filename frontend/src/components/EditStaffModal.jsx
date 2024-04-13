import React, { useState } from 'react';
import { Modal } from '@mui/material';
import { Box, Button } from '@mui/material';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  marginTop: 8,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  
};

const EditStaffModal = ({open, handleClose, staffId, restaurantId}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); 
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/editStaff',
        {
          id: staffId,
          name,
          password,
          email,
          role,  
        },
        {
          headers: {
            _id: userInfo._id,
            Authorization: userInfo.token,
            restaurantId,
          },
        }
      );
      
      setName('');
      setEmail('');
      setPassword('');
      setRole('')

      handleClose();

    } catch (error) {
      console.error('There was an error updating staff details:', error.response?.data || error.message);
    }
  };

  return (
    <>
      {}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography variant='h6' color='initial' sx={{ margin: 1 }}>
            Edit Staff
          </Typography>
          <TextField
            required
            id='outlined-required'
            label='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ margin: 1 }}
          />
          <TextField
            required
            id='outlined-required'
            label='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ margin: 1 }}
          />
          <TextField
            required
            id='outlined-required'
            label='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ margin: 1 }}
          />
          <TextField
            required
            id='outlined-required'
            select
            label='role'
            value={role}
            sx={{ margin: 1 }}
          >
            <MenuItem
              value='kitchen staff'
              onClick={() => setRole('kitchen staff')}
            >
              Kitchen Staff
            </MenuItem>
            <MenuItem
              value='wait staff'
              onClick={() => setRole('wait staff')}
            >
              Wait Staff
            </MenuItem>
            <MenuItem
              value='manager'
              onClick={() => setRole('manager')}
            >
              Manager
            </MenuItem>
          </TextField>
          <Button variant='text' color='primary' onClick={handleSubmit}>
            Edit
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default EditStaffModal;