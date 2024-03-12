import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import SideNav from '../components/SideNav';
import MenuCard from '../components/MenuCard';
import { Button } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import NewItemModal from '../components/NewItemModal';
import EditItemModal from '../components/EditItemModal';
import CategoriesBar from '../components/CategoriesBar';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F19413',
  color: theme.palette.common.white,
  borderRadius: '0.5rem',
  padding: theme.spacing(1.25, 3.25), 
  textTransform: 'none',
  boxShadow: 'none', 
  '&:hover': {
    backgroundColor: '#FFAD3C', 
    boxShadow: 'none',
  },
}));

const MenuScreen = () => {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([]); 
  const [NewItemModalOpen, setNewItemModalOpen] = useState(false);
  const [EditItemModalOpen, setEditItemModalOpen] = useState(false);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const restaurantId = userInfo.restaurant;
  const categoryId = '65ea97143da39234d8571e73';


  const handleOpenNewItemModal = () => {
      setNewItemModalOpen(true);
  };
  
  const handleCloseNewItemModal = () => {
    setNewItemModalOpen(false);
    refreshMenuItems();
  };

  const handleOpenEditItemModal = () => {
    setEditItemModalOpen(true);
  };

  const handleCloseEditItemModal = () => {
    setEditItemModalOpen(false);
    refreshMenuItems();
  };




  const refreshMenuItems = () => {
    fetchMenuItems();
  };

  const fetchMenuItems = async () => {
    try {
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
        <Grid item xs={12} style={{ padding: theme.spacing(1) }}>
          <CategoriesBar restaurantId={restaurantId} userInfo={userInfo}/>
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
        <Grid item xs={12} style={{ padding: theme.spacing(1) }}>
          <StyledButton
            variant="contained"
            onClick={handleOpenNewItemModal}
            sx={{marginRight: '0.75rem'}}
          >
            New Item
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleOpenEditItemModal}
          >
            Edit Item
          </StyledButton>
        </Grid>
      </Grid>
      <NewItemModal
        open={NewItemModalOpen}
        handleClose={handleCloseNewItemModal}
        refreshItems={refreshMenuItems} 
        restaurantId={restaurantId}
        categoryId={categoryId}
      />
      <EditItemModal
        open={EditItemModalOpen}
        handleClose={handleCloseEditItemModal}
        refreshItems={refreshMenuItems} 
        restaurantId={restaurantId}
        categoryId={categoryId}
        menuItems={menuItems}
      />      
    </div>
  );
};

export default MenuScreen;
