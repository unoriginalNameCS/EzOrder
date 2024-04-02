import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
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
        <Box sx={{ width: '100%', minHeight: '100vh'}} style={{ padding: theme.spacing(3), marginLeft: '160px' }}> {/* Adjust marginLeft to the width of SideNav */}
          <Masonry sequential columns={{xs: 1, sm: 3}} spacing={3}>
            {orderList.map((order, index) => {
              const orderDetails = order.order
            return (
              <OrderCard 
                key={index}
                orderNumber={orderList.length - index} 
                tableNumber={orderDetails.tableNum} 
                time={orderDetails.time} 
                items={orderDetails.items} 
                totalQuantity={order.totalQuantity}
                orderId={orderDetails._id}
                state={orderDetails.state}
              />
            );
            })}
          </Masonry>
        </Box>
      </div>
    )
  }
export default KitchenScreen;
