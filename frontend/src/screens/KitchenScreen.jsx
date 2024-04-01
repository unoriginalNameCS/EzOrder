import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import SideNav from '../components/SideNav';
import axios from 'axios';
import { styled, useTheme } from '@mui/material/styles';
import OrderCard from '../components/OrderCard';

const KitchenScreen = () => {
  const theme = useTheme();
  const [orderList, setOrderList] = useState([]); 

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const restaurantId = userInfo.restaurant;

  const fetchOrderList = async () => {
    try {
      const url = `http://localhost:5000/orders/${restaurantId}/orders`;
      const { data } = await axios.get(url);

      setOrderList(data); 
    } catch (error) {
      console.error('There was an error fetching the orders:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  console.log(orderList);

    return (
      <div style={{ display: 'flex' }}>
        <SideNav />
        <Grid container style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: '160px' }}> {/* Adjust marginLeft to the width of SideNav */}
          {orderList.map((order, index) => {
            const orderDetails = order.order
          return (
            <Grid item xs={12} sm={8} md={6} lg={4} key={index} style={{ padding: theme.spacing(2) }}>
              <OrderCard orderNumber={index + 1} tableNumber={orderDetails.tableNum} time={orderDetails.time} items={orderDetails.items} totalQuantity={order.totalQuantity}/>
            </Grid>
          );
          })}
        </Grid>
      </div>
    )
  }
export default KitchenScreen;
