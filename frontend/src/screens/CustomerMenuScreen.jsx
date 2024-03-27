import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import SideNav from '../components/SideNav';
import MenuCard from '../components/MenuCard';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import CustomerCategoriesBar from '../components/CustomerCategoriesBar';
import CustomerItemModal from '../components/CustomerItemModal'; // Import the CustomerItemModal component

const CustomerMenuScreen = () => {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([]); 
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [requestingBill, setRequestingBill] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false); // State for controlling the modal
  
  const [selectedItemId, setSelectedItemId] = useState('');

  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const restaurantId = customerInfo.restaurantId;
  const tableId = customerInfo.tableId;

  const onCategorySelected = (categoryId) => {
    setSelectedCategoryId(categoryId);
    fetchMenuItems(categoryId);
  };

  const handleOpenItemModal = (itemId) => {
    setSelectedItemId(itemId);
    setItemModalOpen(true);
  };

  const handleCloseItemModal = () => {
    setItemModalOpen(false);
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
      console.log(menuItems )
    } catch (error) {
      console.error('There was an error fetching the menu items:', error.response?.data || error.message);
    }
  };

  const requestAssistance = async () => {
    try {
      const url = `http://localhost:5000/tables/${restaurantId}/${tableId}/assistance`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          requestedBill: false
        })
      })
  
      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        setRequesting(true);
      }
    } catch (error) {
      console.error('There was an error fetching the menu items:', error.response?.data || error.message);
    }
  };

  const requestBill = async () => {
    try {
      const url = `http://localhost:5000/tables/${restaurantId}/${tableId}/assistance`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          requestedBill: true
        })
      })
  
      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        setRequestingBill(true);
      }
    } catch (error) {
      console.error('There was an error fetching the menu items:', error.response?.data || error.message);
    }
  };

  // const handleItemClick = (itemId) => {
  //   setSelectedItemId(itemId);
  //   setIsModalOpen(true); // Open the modal
  // };
  // const onItemSelected = (itemId) => {
  //   setSelectedItemId(itemId);
  //   fetchMenuItem(itemId);
  // };

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
      <Grid container style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: '200px' }}>
        <Grid item xs={12} style={{ padding: theme.spacing(1) }}>
          <CustomerCategoriesBar restaurantId={restaurantId} customerInfo={customerInfo} onCategorySelected={onCategorySelected}/>
        </Grid>  
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={12} md={12} lg={6} key={index} style={{ padding: theme.spacing(1) }}>
            <Button onClick={() => handleOpenItemModal(item._id)} style={{ width: '100%', padding: 0, textTransform: "none", textAlign: "left"}}>
              <MenuCard
                title={item.name}
                description={item.description}
                price={item.price.toFixed(2)}
                imageUrl={item.imageUrl || 'https://via.placeholder.com/140'} 
                tags={item.ingredients}
              />
            </Button>
          </Grid>
        ))}
        {!requesting ? <Button 
          variant='contained'
          color='primary'
          sx={{margin: 1}}
          onClick={() => requestAssistance()} style={{ width: '25%', padding: 10, marginLeft: '500px'}}>
          Request Assistance
        </Button> : 
        <Grid container style={{ width:'30%',
          padding: theme.spacing(3),
          backgroundColor: '#5ced80',
          alignItems:"center",
          justifyContent:"center" }}>
          Requesting Assistance
        </Grid>}
        {!requestingBill ? <Button 
          variant='contained'
          color='primary'
          sx={{margin: 1}}
          onClick={() => requestBill()} style={{ width: '25%', padding: 10, marginLeft: '500px'}}>
          Request Bill
        </Button> : 
        <Grid container style={{  width: '25%',
          padding: theme.spacing(3), 
          backgroundColor: '#5ced80',
          marginLeft: '300px',
          alignItems:"center",
          justifyContent:"center" }}>
          Requesting Bill
        </Grid>}
      </Grid>    
      {/* Render the modal */}
      <CustomerItemModal
        open={itemModalOpen}
        handleClose={handleCloseItemModal}
        customerInfo={customerInfo}
        categoryId={selectedCategoryId}
        itemId={selectedItemId}
        // onItemSelected={onItemSelected}
      />
    </div>
  );
};

export default CustomerMenuScreen;