import { Masonry } from '@mui/lab';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import OrderCard from '../components/OrderCard';
import SideNav from '../components/SideNav';


// This page is for wait staff to view their pending customer table requests
const ReadyToServeOrdersScreen = () => {
  const theme = useTheme();
  const [orderList, setOrderList] = useState([]); 

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const restaurantId = userInfo.restaurant;

  const fetchOrderList = async () => {
    try {
      const baseUrl = `http://localhost:5000/orders/${restaurantId}/orders`;
  
      // Fetch all orders concurrently with different query parameters
      const [pendingResponse, preparingResponse] = await Promise.all([
        axios.get(baseUrl, { params: { state: 'serve', isWaiter: true } }),
        axios.get(baseUrl, { params: { state: 'serving', isWaiter: true } }),
      ]);
      setOrderList([...pendingResponse.data, ...preparingResponse.data]);

    } catch (error) {
      console.error('There was an error fetching the orders:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  const triggerOrderUpdate = () => {
    fetchOrderList();
  };
  
  return (
    <div style={{ display: 'flex' }}>
      <SideNav />
      <Box sx={{ width: '100%', minHeight: '100vh'}} style={{ padding: theme.spacing(3), marginLeft: '160px' }}> {/* Adjust marginLeft to the width of SideNav */}
        <Typography variant="h5" component="div" sx={{fontWeight: 800, mb: 2}}>
              Order List
        </Typography>
        <Masonry sequential columns={{xs: 1, sm: 3}} spacing={3}>
          {orderList.map((order, index) => {
            const orderDetails = order.order
          return (
            <OrderCard 
              key={orderDetails._id}
              orderNumber={orderDetails.orderNum} 
              tableNumber={orderDetails.tableNum} 
              time={orderDetails.serveTime} 
              items={orderDetails.items} 
              totalQuantity={order.totalQuantity}
              orderId={orderDetails._id}
              state={orderDetails.state}
              isWaiter={userInfo.role === 'wait staff'}
              onOrderUpdate={triggerOrderUpdate} 
            />
          );
          })}
        </Masonry>
      </Box>
    </div>
  )
};

export default ReadyToServeOrdersScreen;
