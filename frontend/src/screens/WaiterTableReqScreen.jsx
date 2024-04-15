import React, { useEffect, useState } from "react";
import { Masonry } from '@mui/lab';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import RequestCard from '../components/RequestCard';
import SideNav from '../components/SideNav';

const TableRequestsScreen = () => {
  const theme = useTheme();
  const [requestList, setRequestList] = useState([]); 

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const restaurantId = userInfo.restaurant;

  const fetchRequestList = async () => {
    try {
      const baseUrl = `http://localhost:3001/requests/${restaurantId}/requests`;
  
      // Fetch all requests concurrently with different query parameters
      const [pendingResponse, assistingResponse] = await Promise.all([
        axios.get(baseUrl, { params: { state: 'waiting' } }),
        axios.get(baseUrl, { params: { state: 'assisting' } }),
      ]);
      setRequestList([...pendingResponse.data, ...assistingResponse.data]);

    } catch (error) {
      console.error('There was an error fetching the requests:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchRequestList();
  }, []);

  const triggerRequestUpdate = () => {
    fetchRequestList();
  };
  
  return (
    <div style={{ display: 'flex' }}>
      <SideNav />
      <Box sx={{ width: '100%', minHeight: '100vh'}} style={{ padding: theme.spacing(3), marginLeft: '160px' }}> {/* Adjust marginLeft to the width of SideNav */}
        <Typography variant="h5" component="div" sx={{fontWeight: 800, mb: 2}}>
          Request List
        </Typography>
        <Masonry sequential columns={{xs: 1, sm: 3}} spacing={3}>
          {requestList.map((request, index) => {
          return (
            <RequestCard 
              key={request._id}
              requestNumber={request.requestNum} 
              tableNumber={request.tableNum} 
              time={request.time} 
              state={request.state}
              requestId={request._id}
              type={request.requestedBill ? 'Bill' : 'Assistance'}
              onRequestUpdate={triggerRequestUpdate} 
            />
          );
          })}
        </Masonry>
      </Box>
    </div>
  )
};

export default TableRequestsScreen;
