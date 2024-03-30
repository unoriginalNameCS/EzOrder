import React, { useState } from 'react';
import { Modal } from '@mui/material';
import { Box, Button } from '@mui/material';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EditModal(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const [password, setPassword] = useState('');
  const restaurantId = JSON.parse(localStorage.getItem('userInfo')).restaurant;
  const handleEdit = () => {
    axios
      .put(
        'http://localhost:5000/api/users/profile',
        {
          id: props.id,
          name,
          password,
          email,
        },
        {
          headers: {
            _id: JSON.parse(localStorage.getItem('userInfo'))._id,
            Authorization: JSON.parse(localStorage.getItem('userInfo')).token,
            restaurantId,
          },
        }
      )
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          console.log('success');
          setEmail('');
          setName('');
          setPassword('');
          navigate(0)
        }
      });
  };
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

  return (
    <>
      <Button variant="text" color="primary" onClick={handleOpen}>
        Edit
      </Button>
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
          <Button variant='text' color='primary' onClick={handleEdit}>
            Edit
          </Button>
        </Box>
      </Modal>
    </>
  );
}
