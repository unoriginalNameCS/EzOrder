import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import axios from 'axios';

const ProgressButton = ({orderId, state, onOrderUpdate, isWaiter}) => {
  const theme = useTheme();
  const [orderStatus, setOrderStatus] = useState(isWaiter && state === 'serve' ? 'ready' : state);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const restaurantId = userInfo.restaurant;

  const setProgress = async (route) => {
    const url = `http://localhost:5000/orders/${restaurantId}/${orderId}/${route}`;

    try {
      await axios.put(url);
      onOrderUpdate();
    } catch (error) {
      console.error('There was an error setting the progress:', error.response?.data || error.message);
    }
    
  };

  const handleProgress = () => {
    switch (orderStatus) {
      case 'pending':
        setOrderStatus('preparing')
        setProgress('inProgress');
        break;
      case 'preparing':
        setOrderStatus('serve')
        setProgress('prepared');
        break;
      case 'serve':
        return;
      case 'ready':
        setOrderStatus('serving')
        setProgress('serving');
        break;
      case 'serving':
        setOrderStatus('served')
        setProgress('served');
        break;
      case 'served':
        return;
      default:
        return;
    }
  };

  const buttonStyles = {
    'pending': {
        backgroundColor: '#FFFFFF',
        color: '#F19413',
        border: `1px solid #F19413`,
        borderRadius: '0.625rem',
        padding: theme.spacing(1.25, 3.25), 
        textTransform: 'none',
        boxShadow: 'none', 
        '&:hover': {
          backgroundColor: '#F19413',
          color: theme.palette.common.white,
          boxShadow: 'none',
        },
    },
    'preparing': {
      backgroundColor: '#F19413',
      color: theme.palette.common.white,
      borderRadius: '0.625rem',
      padding: theme.spacing(1.25, 3.25), 
      textTransform: 'none',
      boxShadow: 'none', 
      '&:hover': {
        backgroundColor: '##83AE0B', 
        boxShadow: 'none',
      },
    },
    'serve': {
      backgroundColor: '#83AE0B',
      color: theme.palette.common.white,
      borderRadius: '0.625rem',
      padding: theme.spacing(1.25, 3.25), 
      textTransform: 'none',
      boxShadow: 'none', 
      '&:hover': {
        backgroundColor: '#FFAD3C', 
        boxShadow: 'none',
      },
    },
    'ready': {
      backgroundColor: '#FFFFFF',
      color: '#F19413',
      border: `1px solid #F19413`,
      borderRadius: '0.625rem',
      padding: theme.spacing(1.25, 3.25), 
      textTransform: 'none',
      boxShadow: 'none', 
      '&:hover': {
        backgroundColor: '#F19413',
        color: theme.palette.common.white,
        boxShadow: 'none',
      },
    },
    'serving': {
      backgroundColor: '#F19413',
      color: theme.palette.common.white,
      borderRadius: '0.625rem',
      padding: theme.spacing(1.25, 3.25), 
      textTransform: 'none',
      boxShadow: 'none', 
      '&:hover': {
        backgroundColor: '##83AE0B', 
        boxShadow: 'none',
      },
    },
    'served': {
      backgroundColor: '#83AE0B',
      color: theme.palette.common.white,
      borderRadius: '0.625rem',
      padding: theme.spacing(1.25, 3.25), 
      textTransform: 'none',
      boxShadow: 'none', 
      '&:hover': {
        backgroundColor: '#FFAD3C', 
        boxShadow: 'none',
      },
    },
  };

  return (
    <div>
    {!isWaiter ?
      <Button
        onClick={handleProgress}
        style={buttonStyles[orderStatus]}
        sx={{marginTop: '1rem'}}
        startIcon={
          orderStatus === 'serve'? <DoneIcon/> : <TimerOutlinedIcon/>
        }
      >
        {orderStatus.toUpperCase()}
      </Button> :
      <Button
        onClick={handleProgress}
        style={buttonStyles[orderStatus]}
        sx={{marginTop: '1rem'}}
        startIcon={
          orderStatus === 'served' ? <DoneIcon/> : <TimerOutlinedIcon/>
        }
      >
        {orderStatus.toUpperCase()}
      </Button>
    }
    </div>
  );
};
  

export default ProgressButton