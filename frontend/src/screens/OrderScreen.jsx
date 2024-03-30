import React, { useEffect, useState } from 'react';
import SideNav from '../components/SideNav';
import axios from 'axios';
import { useTheme } from '@mui/material';
import { Grid, Typography } from '@mui/material';
import CartCard from '../components/CartCard';

export default function OrderScreen() {
  const theme = useTheme();
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const restaurantId = customerInfo.restaurantId;
  const tableId = customerInfo.tableId;
  const [items, setItems] = useState([])
  useEffect(() => {
    axios.get(`http://localhost:5000/tables/${restaurantId}/${tableId}/orders/items`).then(res => {
        setItems(res.data)
    })
  }, [restaurantId, tableId]);
  let totalPrice = 0;
  for (let item of items){
    // console.log(item)
    totalPrice += item.menuItem.price * item.quantity
  }
  console.log(items)
  return (
    <>
        <SideNav/>
      <Grid container style={{ flexGrow: 1, marginLeft: '200px' , padding: theme.spacing(3)}}> 
        <Typography variant="h6" component="h2">
          Ordered Items
        </Typography>
        {items.length === 0 ? (
          <Grid item xs={12}>
            <Typography>
              You haven't sent any order!
            </Typography>
          </Grid>
        ) : (
          items.map((item,i) => (
            <Grid item xs={12} key={i} style={{padding: theme.spacing(1)}} >
              <CartCard
                title={item.menuItem.name}
                description={item.menuItem.description}
                price={(item.menuItem.price * item.quantity).toFixed(2)}
                imageUrl={item.menuItem.imageUrl || 'https://via.placeholder.com/140'} 
                tags={item.menuItem.ingredients}
                quantity={item.quantity}
              />
            </Grid>
          ))
        )}
              <Typography variant="h4" color="initial">Total Price: {totalPrice} </Typography>
      </Grid>
    </>

  );
}
