import React, { useEffect, useCallback, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

const CustomerItemModal = ({ open, handleClose, customerInfo, categoryId, itemId }) => {
  const [menuItem, setMenuItem] = useState({});
  const tableId = customerInfo.tableId;
  const restaurantId = customerInfo.restaurantId;

//   const handleItemClick = (itemId) => {
//     if(onItemSelected) {
//       onItemSelected(itemId);
//     }
//   };
  
  const fetchMenuItem = useCallback(async () => {
    try {
      const url = `http://localhost:5000/menus/${restaurantId}/${tableId}/menu/categories/${categoryId}/items/${itemId}`;

      const { data } = await axios.get(url, {
        
      });

      setMenuItem(data); 
    } catch (error) {
      console.error('There was an error fetching the categories:', error.response?.data || error.message);
    }
  }, [restaurantId, tableId, categoryId, itemId]);

  useEffect(() => {
    fetchMenuItem();
  }, []);

  useEffect(() => {
    fetchMenuItem();
  }, [fetchMenuItem]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {menuItem.name}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {menuItem.description}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Price: {menuItem.price}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Ingredients: {menuItem.ingredients}
        </Typography>
        <img src={menuItem.imageUrl} alt={menuItem.name} style={{ width: '100%', marginTop: '10px' }} />
        {/* <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ mt: 2 }}
        >
          Add to Cart
        </Button> */}
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
      </Box>
    </Modal>
  );
};

export default CustomerItemModal;
