import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled, useTheme } from '@mui/material/styles';
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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const NewItemModal = ({ open, handleClose, restaurantId, categoryId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    ingredients: '',
    position: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); 

    try {
      console.log('Sending the following data:', formData);
      const response = await axios.post(
        `http://localhost:5000/menus/${restaurantId}/menu/categories/${categoryId}/items/add`, 
        {
          itemName: formData.name,
          description: formData.description,
          price: parseInt(formData.price), 
          ingredients: formData.ingredients.split(',').map(ingredient => ingredient.trim()), 
          imageUrl: "",
        },
        {
          headers: {
            Authorization: `${userInfo.token}`,
          },
        }
      );
      console.log('Item added:', response.data); 
      handleClose(); 
    } catch (error) {
      console.error('There was an error adding the item:', error.response?.data || error.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="new-item-modal-title"
      aria-describedby="new-item-modal-description"
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
        <Typography id="new-item-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Add Item
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            helperText="Separate ingredients with commas"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          {/* <TextField
            margin="normal"
            required
            fullWidth
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            type="number"
            InputProps={{
              inputProps: { min: 0, max: 10}
              
            }}
            sx={{ mb: 3 }}
          /> */}
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
              <VisuallyHiddenInput 
                type="file"
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{marginLeft: '4.25rem' }}
            >
              Confirm
            </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewItemModal;
