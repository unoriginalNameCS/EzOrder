import React, { useEffect, useCallback, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';
import { FaPlus, FaMinus } from 'react-icons/fa';

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
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const tableId = customerInfo.tableId;
  const restaurantId = customerInfo.restaurantId;

  const handleQuantityChange = (type) => {
    setQuantity((prevQuantity) => {
      if (type === 'decrease' && prevQuantity > 1) {
        return prevQuantity - 1;
      } else if (type === 'increase') {
        return prevQuantity + 1;
      }
      return prevQuantity;
    });
  };
  
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

  const handleAddToCart = async (e) => {

    e.preventDefault();

    try {
      console.log(notes);
      const response = await axios.post(
        `http://localhost:5000/tables/${restaurantId}/${tableId}/${itemId}/addItem`,
        {
          notes: notes,
          quantity: quantity
        }
      );
      console.log('Item added:', response.data); 
      handleClose(); 
    } catch (error) {
      console.error('There was an error adding the item:', error.response?.data || error.message);
    }

    // Handle adding the item to the cart here
    console.log('Item added to cart:', menuItem);
  };

  return (
    <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={modalStyle}>
    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ fontWeight: 'bold' }}>
      {menuItem.name}
    </Typography>
    <img src={menuItem.imageUrl} alt={menuItem.name} style={{ width: '50%', marginTop: '10px' }} />
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
    <TextField
      label="Notes"
      multiline
      rows={4}
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      variant="outlined"
      fullWidth
      sx={{ mt: 2 }}
    />
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <IconButton onClick={() => handleQuantityChange('decrease')}>
        <FaMinus />
      </IconButton>
      <Typography sx={{ mx: 2 }}>{quantity}</Typography>
      <IconButton onClick={() => handleQuantityChange('increase')}>
        <FaPlus />
      </IconButton>
    </Box>
    <Button
      variant="contained"
      onClick={handleAddToCart}
      sx={{ mt: 2 }}>
      Add to Cart
    </Button>
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
