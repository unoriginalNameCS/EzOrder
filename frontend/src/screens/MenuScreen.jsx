import React from 'react';
import Grid from '@mui/material/Grid';
import SideNav from '../components/SideNav';
import MenuCard from '../components/MenuCard';
import { useTheme } from '@mui/material/styles';

const MenuScreen = () => {
  const theme = useTheme();
  const dummyMenuCards = Array.from({ length: 8 }); // Simulate 6 menu cards.

  return (
    <div style={{ display: 'flex' }}>
      <SideNav/>
      <Grid container style={{ flexGrow: 1, padding: theme.spacing(6), marginLeft: '10rem' }}> {/* Assuming you have a CSS variable for SideNav width */}
        {dummyMenuCards.map((_, index) => (
          <Grid item xs={12} sm={12} md={12} lg={6} key={index} padding={theme.spacing(1)}> {/* Adjust padding to control horizontal spacing */}
            <MenuCard />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MenuScreen;
