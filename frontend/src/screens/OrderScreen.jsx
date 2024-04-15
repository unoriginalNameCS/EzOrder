import React, { useEffect, useState } from 'react';
import CustomerSideNav from '../components/CustomerSideNav';
import axios from 'axios';
import { useTheme } from '@mui/material';
import { Grid, Typography, Button } from '@mui/material';
import CartCard from '../components/CartCard';
import CheckOutModal from '../components/CheckOutModal';
import { toast } from 'react-toastify'
export default function OrderScreen() {
  const theme = useTheme();
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const restaurantId = customerInfo.restaurantId;
  const tableId = customerInfo.tableId;
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/tables/${restaurantId}/${tableId}/orders/items`
      )
      .then((res) => {
        setItems(res.data);
      });
  }, [restaurantId, tableId]);
  let totalPrice = 0;
  for (let item of items) {
    totalPrice += item.menuItem.price * item.quantity;
  }
  const requestBill = async () => {
    try {
      const url = `http://localhost:3001/tables/${restaurantId}/${tableId}/assistance`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          requestedBill: true
        })
      })
  
      const data = await response.json();

      if (response.status === 201) {
        toast.success('Requesting Bill');
      }
    } catch (error) {
      console.error('There was an error fetching the menu items:', error.response?.data || error.message);
    }
  };
  return (
    <>
      <CustomerSideNav />
      <Grid
        container
        style={{ flexGrow: 1, marginLeft: '200px', padding: theme.spacing(3) }}
      >
        <Typography variant='h5' component='h2' sx={{ fontWeight: 800, mb: 1 }}>
          Ordered Items
        </Typography>
        {items.length === 0 ? (
          <Grid item xs={12}>
            <Typography>You haven't sent any order!</Typography>
          </Grid>
        ) : (
          items.map((item, i) => (
            <Grid item xs={12} key={i} style={{ padding: theme.spacing(1) }}>
              <CartCard
                title={item.menuItem.name}
                description={item.menuItem.description}
                price={(item.menuItem.price * item.quantity).toFixed(2)}
                imageUrl={
                  item.menuItem.imageUrl || 'https://via.placeholder.com/140'
                }
                tags={item.menuItem.ingredients}
                notes={item.notes}
                quantity={item.quantity}
              />
            </Grid>
          ))
        )}
        <Grid item xs={12}>
          <Typography
            variant='h5'
            color='initial'
            sx={{ fontWeight: 400, mt: 1 }}
          >
            Total: ${totalPrice.toFixed(2)}{' '}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ padding: theme.spacing(1) }}>
          <CheckOutModal total={totalPrice.toFixed(2)}></CheckOutModal>
        </Grid>
        <Grid item xs={12} style={{ padding: theme.spacing(1) }}>
          {<Button 
            variant='contained'
            color='primary'
            onClick={() => requestBill()}>
            Request Bill
          </Button>}
        </Grid>
      </Grid>
    </>
  );
}
