import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import SideNav from '../components/SideNav';
import MenuCard from '../components/MenuCard';
import { Button } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import NewItemModal from '../components/NewItemModal';
import EditItemModal from '../components/EditItemModal';
import DeleteItemModal from '../components/DeleteItemModal';
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
  const [DeleteItemModalOpen, setDeleteItemModalOpen] = useState(false);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isManager = userInfo.role === 'manager';
  const restaurantId = userInfo.restaurant;


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

  const handleOpenDeleteItemModal = () => {
    setDeleteItemModalOpen(true);
  };

  const handleCloseDeleteItemModal = () => {
    setDeleteItemModalOpen(false);
    refreshMenuItems();
  };

  const refreshMenuItems = () => {
    fetchMenuItems();
  };

  const onCategorySelected = (categoryId) => {
    setSelectedCategoryId(categoryId);   
  };

  const fetchMenuCategories = async () => {
    try {
      const url = `http://localhost:5000/menus/${restaurantId}/menu/categories`;
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `${userInfo.token}`, 
        },
      });
      setMenuCategories(data);
      if (data.length > 0) {
        setSelectedCategoryId(data[0]._id);
      } else {
        setSelectedCategoryId('');
        setMenuItems([]);
      }
    } catch (error) {
      console.error('There was an error fetching the categories:', error.response?.data || error.message);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const url = `http://localhost:5000/menus/${restaurantId}/menu/categories/${selectedCategoryId}/items`;

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
    fetchMenuCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchMenuItems();
    } else {
      setMenuItems([]);
    }
  }, [selectedCategoryId]);

  return (
    <div style={{ display: 'flex' }}>
      <SideNav />
      <Grid container style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: '200px' }}> {/* Adjust marginLeft to the width of SideNav */}
        <Grid item xs={12} style={{ padding: theme.spacing(1) }}>
          <CategoriesBar restaurantId={restaurantId} userInfo={userInfo} onCategorySelected={onCategorySelected}/>
        </Grid>  
          
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={12} md={12} lg={6} key={item._id} style={{ padding: theme.spacing(1) }}>
            <MenuCard
              title={item.name}
              description={item.description}
              price={item.price.toFixed(2)}
              imageUrl={item.imageUrl || 'https://via.placeholder.com/140'} 
              tags={item.ingredients} // 
            />
          </Grid>
        ))}
        {isManager && (<Grid item xs={12} style={{ padding: theme.spacing(1) }}>
          <StyledButton
            variant="contained"
            onClick={handleOpenNewItemModal}
            sx={{marginRight: '0.75rem'}}
            disabled={selectedCategoryId === ''}
          >
            New Item
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleOpenEditItemModal}
            sx={{marginRight: '0.75rem'}}
            disabled={menuItems.length === 0}
          >
            Edit Item
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleOpenDeleteItemModal}
            disabled={menuItems.length === 0}
          >
            Delete Item
          </StyledButton>
        </Grid>
      )}
      </Grid>
      {isManager && (<>
        <NewItemModal
          open={NewItemModalOpen}
          handleClose={handleCloseNewItemModal}
          refreshItems={refreshMenuItems} 
          restaurantId={restaurantId}
          categoryId={selectedCategoryId}
        />
        <EditItemModal
          open={EditItemModalOpen}
          handleClose={handleCloseEditItemModal}
          refreshItems={refreshMenuItems} 
          restaurantId={restaurantId}
          categoryId={selectedCategoryId}
          menuItems={menuItems}
        />
        <DeleteItemModal
          open={DeleteItemModalOpen}
          handleClose={handleCloseDeleteItemModal}
          refreshItems={refreshMenuItems} 
          restaurantId={restaurantId}
          categoryId={selectedCategoryId}
          menuItems={menuItems}
        />
      </>)}      
    </div>
  );
};

export default MenuScreen;