import React, { useEffect, useCallback, useState } from 'react';
import { Box, Typography, Paper, Container, IconButton } from '@mui/material';
import axios from 'axios';
import SideNav from '../components/SideNav';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { FaMinus } from 'react-icons/fa';



const CartScreen = () => {
  const theme = useTheme();

  const [cartItems, setCartItems] = useState([]);
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const restaurantId = customerInfo.restaurantId;
  const tableId = customerInfo.tableId;

  const fetchCartItems = useCallback(async () => {
    try {
      const url = `http://localhost:5000/tables/${restaurantId}/${tableId}/cart`;
      const { data } = await axios.get(url);
            
      setCartItems(data);

      console.log(data.length);
    } catch (error) {
      console.error('There was an error fetching the cart items:', error.response?.data || error.message);
    }
  }, [restaurantId, tableId]);

  const handleRemove = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:5000/tables/${restaurantId}/${tableId}/${cartItemId}/removeItem`);
      refreshCartItems();
    } catch (error) {
      console.error('Error removing item:', error.response?.data || error.message);
    }
  };

  const refreshCartItems = () => {
    fetchCartItems();
  };

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return (
    <div style={{ display: 'flex' }}>
      <SideNav />
      <Grid container style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: '200px' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" component="h2">
            Cart Items
          </Typography>
          {cartItems.length === 0 ? (
            <Typography>Your cart is empty.</Typography>
          ) : (
            cartItems.map((item) => (
              <Box key={item._id} sx={{ mt: 2, position: 'relative' }}>
                <IconButton onClick={() => handleRemove(item._id)} style={{ position: 'absolute', top: 0, right: 0 }}>
                  <FaMinus />
                </IconButton>
                <Typography>Name: {item.menuItem.name}</Typography>
                <Typography>Description: {item.menuItem.description}</Typography>
                <Typography>Price: {item.menuItem.price}</Typography>
                <Typography>Ingredients: {item.menuItem.ingredients}</Typography>
                <Typography>Notes: {item.notes}</Typography>
                <Typography>Quantity: {item.quantity}</Typography>
                <img src={item.menuItem.imageUrl} alt={item.menuItem.name} style={{ width: '50%', marginTop: '10px' }} />
              </Box>
            ))
          )}
        </Paper>
      </Grid>
    </div>
  );
};

export default CartScreen;