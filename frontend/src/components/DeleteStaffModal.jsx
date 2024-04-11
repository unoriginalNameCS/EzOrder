import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};


const DeleteStaffModal = ({ open, handleClose, staffId, restaurantId}) => {
  
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); 
    try {
      const response = await axios.delete(`http://localhost:5000/api/users/delete/${staffId}`, {
        headers: {
          _id: userInfo._id,
          Authorization: userInfo.token,
          restaurantId,
        },
      });
      if (response.status === 200) {
        setDeleteSuccess(true); // Indicate that the deletion was successful
      }
    } catch (error) {
      console.error('There was an error deleting the item:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (deleteSuccess) {
      handleClose(); // Close the modal if the deletion was successful
      setDeleteSuccess(false); // Reset the deletion success status
    }
  }, [deleteSuccess, handleClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="order-category-modal-title"
      aria-describedby="order-category-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="new-item-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
          Are you sure you want to remove this staff?
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
            >
              Confirm
            </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteStaffModal;
