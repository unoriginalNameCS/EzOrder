import React, { useEffect, useCallback, useState } from 'react';
import { Box, Typography, Paper, Container, IconButton } from '@mui/material';
import axios from 'axios';
import SideNav from '../components/SideNav';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { FaMinus } from 'react-icons/fa';
import CartCard from '../components/CartCard';


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
      console.log(cartItemId);
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
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <SideNav />
      <Grid container style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: '200px' }}> 
        <Typography variant="h6" component="h2">
          Cart Items
        </Typography>
        {cartItems.length === 0 ? (
          <Grid item xs={12}>
            <Typography>
              Your cart is empty.
            </Typography>
          </Grid>
        ) : (
          cartItems.map((item) => (
            <Grid item xs={12} key={item._id} style={{ padding: theme.spacing(1) }}>
              <CartCard
                title={item.menuItem.name}
                description={item.menuItem.description}
                price={(item.menuItem.price * item.quantity).toFixed(2)}
                imageUrl={item.menuItem.imageUrl || 'https://via.placeholder.com/140'} 
                tags={item.menuItem.ingredients}
                notes={item.notes}
                quantity={item.quantity}
              />
              <IconButton onClick={() => handleRemove(item._id)}>
                <FaMinus/>
              </IconButton>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default CartScreen;