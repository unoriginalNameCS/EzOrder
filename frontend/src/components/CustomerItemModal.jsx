import React, { useEffect, useCallback, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { BiCart } from "react-icons/bi";



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

const Ingredients = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1), 
  marginTop: theme.spacing(1),
}));

const Tag = styled(Typography)(({ theme }) => ({
  color: 'white',
  backgroundColor: '#83AE0B',
  borderRadius: theme.shape.borderRadius,
  borderColor: '#83AE0B',
  padding: theme.spacing(0.5, 1),
  fontSize: '0.5rem',
}));

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
      const url = `http://localhost:3001/customermenus/${restaurantId}/${tableId}/menu/categories/${categoryId}/items/${itemId}`;

      const { data } = await axios.get(url, {
        
      });

      setMenuItem(data); 
    } catch (error) {
      console.error('There was an error fetching the item:', error.response?.data || error.message);
    }
  }, [restaurantId, tableId, categoryId, itemId]);

  useEffect(() => {
    if (categoryId && itemId) {
      setQuantity(1);
      setNotes('')
      fetchMenuItem();
    }
  }, [categoryId, itemId]);

  const handleAddToCart = async (e) => {

    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3001/tables/${restaurantId}/${tableId}/${itemId}/addItem`,
        {
          notes: notes,
          quantity: quantity
        }
      );
      handleClose(); 
    } catch (error) {
      console.error('There was an error adding the item:', error.response?.data || error.message);
    }
  };

  return (
    <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={modalStyle}>
  <Box sx={{ textAlign: 'center' }}>
      <Typography id="modal-modal-title" variant="h6" component="h2" style={{ fontWeight: 'bold' }}>
        {menuItem.name}
      </Typography>
      <img src={menuItem.imageUrl} alt={menuItem.name} style={{ width: '100%', marginTop: '10px' }} />
    </Box>
    <Typography id="modal-modal-description" variant="body2" sx={{ fontSize: '12px' }}>
      {menuItem.description}
    </Typography>
    {menuItem && menuItem.ingredients && (
      <Ingredients>
        {menuItem.ingredients.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))}
      </Ingredients>  
    )}
    <TextField
      label="Notes"
      multiline
      rows={2}
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
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
      <Button variant="contained" onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
        <CloseIcon fontSize="small" sx={{ marginRight: '0.5rem' }}/>
        Close
      </Button>
      <Button variant="contained" onClick={handleAddToCart} sx={{ display: 'flex', alignItems: 'center' }}>
        <BiCart sx={{ marginRight: '0.5rem' }}/>
        Add to Cart - ${(menuItem.price * quantity).toFixed(2)}
      </Button>
    </Box>
  </Box>
</Modal>
  );
};

export default CustomerItemModal;
