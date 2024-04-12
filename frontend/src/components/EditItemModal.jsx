import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

const EditItemModal = ({ open, handleClose, restaurantId, categoryId, menuItems }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [itemDetails, setItemDetails] = useState({});
  const [newDescription, setNewDescription] = useState('');
  const [newIngredients, setNewIngredients] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const details = menuItems.find(item => item.name === selectedItem);
    setItemDetails(details);
  }, [selectedItem, menuItems]);


  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setNewDescription(event.target.value);
    setItemDetails(prevDetails => ({
      ...prevDetails,
      description: event.target.value,
    }));
  };

  const handleIngredientsChange = (event) => {
    setNewIngredients(event.target.value);
    setItemDetails(prevDetails => ({
      ...prevDetails,
      ingredients: event.target.value.split(',').map(ingredient => ingredient.trim()),
    }));
  };

  const handlePriceChange = (event) => {
    setNewPrice(event.target.value);
    setItemDetails(prevDetails => ({
      ...prevDetails,
      price: event.target.value,
    }));
  };

  const handlePositionChange = (event) => {
    setNewPosition(event.target.value);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error('No file selected.');
      return;
    }

    try {
      const dataUrl = await convertFileToDataUrl(file);
      console.log(dataUrl)
      setNewImageUrl(dataUrl);
      setItemDetails(prevDetails => ({
        ...prevDetails,
        imageUrl: dataUrl,
      }))
    } catch (error) {
      console.error(error);
    }
  }

  function convertFileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      }
      reader.onerror = (error) => {
        reject(error);
      }
      reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); 
    try {
      console.log('Updating the following item:', selectedItem);
      const response = await axios.patch(
        `http://localhost:5000/menus/${restaurantId}/menu/categories/${categoryId}/items/${itemDetails._id}/update`, 
        {
          ...itemDetails, price: parseInt(itemDetails.price)
        },
        {
          headers: {
            Authorization: `${userInfo.token}`,
          },
        }
      );
      console.log('Item updated:', response.data);
       
      setSelectedItem('');
      setItemDetails({});
      setNewDescription('');
      setNewIngredients('');
      setNewPrice('');
      setNewImageUrl('');
      setNewPosition('');

      handleClose(); 
    } catch (error) {
      console.error('There was an error updating the item:', error.response?.data || error.message);
    }

    if (newPosition) {
      try {
        console.log('Moving the following item:', selectedItem, newPosition);
        const response = await axios.put(
          `http://localhost:5000/menus/${restaurantId}/menu/categories/${categoryId}/items/order`, 
          {
            itemName: selectedItem,
            newPosition: newPosition
          },
          {
            headers: {
              Authorization: `${userInfo.token}`,
            },
          }
        );
        console.log('Item moved:', response.data); 
        handleClose(); 
      } catch (error) {
        console.error('There was an error moving the item:', error.response?.data || error.message);
      }
    }
  };


  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="order-item-modal-title"
      aria-describedby="order-item-modal-description"
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
          Edit Item
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Item</InputLabel>
            <Select
              value={selectedItem}
              onChange={handleItemChange}
              label="Item"
            >
              {menuItems.map((item) => (
                <MenuItem key={item._id} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedItem && itemDetails ? (
          <>
            <TextField
              margin="normal"
              fullWidth
              multiline
              label={"Description"}
              name="description"
              value={newDescription}
              placeholder={itemDetails.description.slice(0, 35) + '...'}
              onChange={handleDescriptionChange} />
            <TextField
              margin="normal"
              fullWidth
              label="Price"
              name="price"
              value={newPrice}
              placeholder={String(itemDetails.price)}
              onChange={handlePriceChange} />
            <TextField
              margin="normal"
              fullWidth
              label="Ingredients"
              name="ingredients"
              value={newIngredients}
              onChange={handleIngredientsChange}
              placeholder={itemDetails.ingredients.join(",")}
              helperText="Separate ingredients with commas"
              sx={{ mb: 3 }} />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>New Position</InputLabel>
              <Select
                value={newPosition}
                onChange={handlePositionChange}
                label="New Position"
              >
                {Array.from({ length: menuItems.length }, (_, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {index + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
            component="label"
            role={undefined}
            variant={newImageUrl ? "contained" : "outlined" }
            color={newImageUrl ? "success" : "primary"}
            tabIndex={-1}
            startIcon={newImageUrl ? <CheckCircleIcon /> : <CloudUploadIcon /> }
            >
              {newImageUrl ? "Upload Success" : "Upload Image"}
              <VisuallyHiddenInput 
                type="file"
                label="Image"
                name='image'
                accept='.jpeg, .png, .jpg'
                onChange={handleImageChange}
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={newImageUrl ? {marginLeft: '2.75rem'} : {marginLeft: '4.25rem' }}
            >
              Confirm
            </Button>
          </>
          ) : <></>}
        </Box>
      </Box>
    </Modal>
  );
};

export default EditItemModal;
