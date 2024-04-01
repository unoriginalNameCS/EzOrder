import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import SideNav from '../components/SideNav';
import { styled, useTheme } from '@mui/material/styles';
import OrderCard from '../components/OrderCard';

const KitchenScreen = () => {
  const [orderList, setOrderList] = useState([]); 

  const theme = useTheme();

    return (
      <div style={{ display: 'flex' }}>
        <SideNav />
        <Grid container style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: '160px' }}> {/* Adjust marginLeft to the width of SideNav */}
          <OrderCard/>
        </Grid>
      </div>
    )
  }
export default KitchenScreen;
