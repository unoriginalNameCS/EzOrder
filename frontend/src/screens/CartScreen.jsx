import React, { useEffect, useCallback, useState } from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import axios from 'axios';
import SideNav from '../components/SideNav';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';



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
                <Box key={item._id} sx={{ mt: 2 }}>
                <Typography>Name: {item.name}</Typography>
                <Typography>Description: {item.description}</Typography>
                <Typography>Price: {item.price}</Typography>
                <Typography>Ingredients: {item.ingredients}</Typography>
                <Typography>Notes: {item.notes}</Typography>
                <Typography>Quantity: {item.quantity}</Typography>
                <img src={item.imageUrl} alt={item.name} style={{ width: '100%', marginTop: '10px' }} />
                </Box>
            ))
            )}
        </Paper>
        </Grid>
    </div>
  );
};

export default CartScreen;