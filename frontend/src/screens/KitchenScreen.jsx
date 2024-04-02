import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import SideNav from '../components/SideNav';
import axios from 'axios';
import { styled, useTheme } from '@mui/material/styles';
import OrderCard from '../components/OrderCard';
import { Typography } from '@mui/material';

const KitchenScreen = () => {
  const theme = useTheme();

  const [pendingOrders, setPendingOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [orderList, setOrderList] = useState([]); 

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const restaurantId = userInfo.restaurant;

  const fetchOrderList = async () => {
    try {
      const pendingUrl = `http://localhost:5000/orders/${restaurantId}/pendingOrders`;
      const preparingUrl = `http://localhost:5000/orders/${restaurantId}/preparingOrders`;
      const completedUrl = `http://localhost:5000/orders/${restaurantId}/completedOrders`;
  
      // Fetch all orders concurrently
      const [pendingResponse, preparingResponse, completedResponse] = await Promise.all([
        axios.get(pendingUrl),
        axios.get(preparingUrl),
        axios.get(completedUrl),
      ]);
  
      // Update the states accordingly
      setPendingOrders(pendingResponse.data);
      setPreparingOrders(preparingResponse.data);
      setCompletedOrders(completedResponse.data);
  
      // Concatenate all orders and update orderList
      setOrderList([...pendingResponse.data, ...preparingResponse.data, ...completedResponse.data]);
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
                orderNumber={orderList.length - index} 
                tableNumber={orderDetails.tableNum} 
                time={orderDetails.time} 
                items={orderDetails.items} 
                totalQuantity={order.totalQuantity}
                orderId={orderDetails._id}
                state={orderDetails.state}
                onOrderUpdate={triggerOrderUpdate} 
              />
            );
            })}
          </Masonry>
        </Box>
      </div>
    )
  }
export default KitchenScreen;
