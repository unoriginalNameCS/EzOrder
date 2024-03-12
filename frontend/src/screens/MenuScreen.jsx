import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import SideNav from '../components/SideNav';
import MenuCard from '../components/MenuCard';
import { useTheme } from '@mui/material/styles';

const MenuScreen = () => {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([]); // State to store menu items for the selected category

  const fetchMenuItems = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const restaurantId = userInfo.restaurant;
      const categoryId = '65ea97143da39234d8571e73';

      const url = `http://localhost:5000/menus/${restaurantId}/menu/categories/${categoryId}/items`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `${userInfo.token}`, 
        },
      });

      setMenuItems(data); 
    } catch (error) {
      console.error('There was an error fetching the menu items:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <SideNav />
      <Grid container style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: '200px' }}> {/* Adjust marginLeft to the width of SideNav */}
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={12} md={12} lg={6} key={index} style={{ padding: theme.spacing(1) }}>
            <MenuCard
              title={item.name}
              description={item.description}
              price={item.price.toFixed(2)}
              imageUrl={item.imageUrl || 'https://via.placeholder.com/140'} 
              tags={item.ingredients} // 
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MenuScreen;
