import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import SideNav from '../components/SideNav';
import MenuCard from '../components/MenuCard';
import { useTheme } from '@mui/material/styles';

import CustomerCategoriesBar from '../components/CustomerCategoriesBar';

const CustomerMenuScreen = () => {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([]); 
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const restaurantId = customerInfo.restaurantId;
  const tableId = customerInfo.tableId;


  const onCategorySelected = (categoryId) => {
    setSelectedCategoryId(categoryId);
    fetchMenuItems(categoryId);
  };

  const fetchMenuCategories = async () => {
    try {
      const url = `http://localhost:5000/menus/${restaurantId}/${tableId}/menu/categories`;
      const { data } = await axios.get(url, {
        // headers: {
        //   Authorization: `${userInfo.token}`, 
        // },
        // Need to add authorization to check if tableId has restuarantId
      });
      setMenuCategories(data);
      if (data.length > 0) {
        setSelectedCategoryId(data[0]._id); // Set the first category as default
      }
    } catch (error) {
      console.error('There was an error fetching the categories:', error.response?.data || error.message);
    }
  };

  const fetchMenuItems = async () => {
    console.log(selectedCategoryId)
    try {
      const url = `http://localhost:5000/menus/${restaurantId}/${tableId}/menu/categories/${selectedCategoryId}/items`;

      const { data } = await axios.get(url, {
        // headers: {
        //   Authorization: `${userInfo.token}`, 
        // },
        // Need to add authorization to check if tableId has restuarantId
      });

      setMenuItems(data); 
    } catch (error) {
      console.error('There was an error fetching the menu items:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMenuCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchMenuItems(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  return (
    <div style={{ display: 'flex' }}>
      <SideNav />
      <Grid container style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: '200px' }}> {/* Adjust marginLeft to the width of SideNav */}
        <Grid item xs={12} style={{ padding: theme.spacing(1) }}>
          <CustomerCategoriesBar restaurantId={restaurantId} customerInfo={customerInfo} onCategorySelected={onCategorySelected}/>
        </Grid>  
          
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

export default CustomerMenuScreen;