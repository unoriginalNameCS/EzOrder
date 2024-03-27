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
      console.error('There was an error fetching the item:', error.response?.data || error.message);
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
    <Typography id="modal-modal-title" variant="h4" component="h2" style={{ fontWeight: 'bold' }}>
      {menuItem.name}
    </Typography>
    <img src={menuItem.imageUrl} alt={menuItem.name} style={{ width: '100%', marginTop: '10px' }} />
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
      <Typography id="modal-modal-description">
        {menuItem.description}
      </Typography>
    </Box>
    <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
      Price: {menuItem.price}
    </Typography>
    <Typography sx={{ mt: 2 }}>
      Ingredients: {menuItem.ingredients}
    </Typography>
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
