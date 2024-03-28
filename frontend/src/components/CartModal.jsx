import React, { useEffect, useCallback, useState } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

const CartModal = ({ open, handleClose, customerInfo }) => {
  const [cartItems, setCartItems] = useState([]);
  const tableId = customerInfo.tableId;
  const restaurantId = customerInfo.restaurantId;

  const fetchCartItems = useCallback(async () => {
    try {
      const url = `http://localhost:5000/tables/${restaurantId}/${tableId}/cart`;
      const { data } = await axios.get(url);
      setCartItems(data); 
    } catch (error) {
      console.error('There was an error fetching the cart items:', error.response?.data || error.message);
    }
  }, [restaurantId, tableId]);

  useEffect(() => {
    if (open) {
      fetchCartItems();
    }
  }, [open, fetchCartItems]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Cart Items
        </Typography>
        {cartItems.map((item, index) => (
          <Box key={index} sx={{ mt: 2 }}>
            <Typography>
              Name: {item.name}
            </Typography>
            <Typography>
              Description: {item.description}
            </Typography>
            <Typography>
              Price: {item.price}
            </Typography>
            <Typography>
              Ingredients: {item.ingredients}
            </Typography>
            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', marginTop: '10px' }} />
          </Box>
        ))}
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

export default CartModal;