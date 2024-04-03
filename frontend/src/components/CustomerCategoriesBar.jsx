import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';

  const CategoryButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#FBFBF2',
    color: '#83AE0B',
    borderRadius: '0.5rem',
    borderColor: '#83AE0B',
    padding: theme.spacing(1.25, 3.25), 
    textTransform: 'none',
    boxShadow: 'none', 
    '&:hover': {
      backgroundColor: '#83AE0B', 
      boxShadow: 'none',
      color: '#FFFFFF',
      borderColor: '#83AE0B'
    },
  }));

  const CustomerCategoriesBar = ({restaurantId, customerInfo, onCategorySelected}) => {
    const theme = useTheme();
    const [menuCategories, setMenuCategories] = useState([]);
    const tableId = customerInfo.tableId;

    const handleCategoryClick = (categoryId) => {
      if(onCategorySelected) {
        onCategorySelected(categoryId);
      }
    };

    const fetchMenuCategories = useCallback(async () => {
      try {
        const url = `http://localhost:5000/menus/${restaurantId}/${tableId}/menu/categories`;
  
        const { data } = await axios.get(url, {
          // headers: {
          //   Authorization: `${userInfo.token}`, 
          // },
        });
  
        setMenuCategories(data); 
      } catch (error) {
        console.error('There was an error fetching the categories:', error.response?.data || error.message);
      }
    }, [restaurantId, tableId]);
    
    useEffect(() => {
      fetchMenuCategories();
    }, []);

    useEffect(() => {
      fetchMenuCategories();
    }, [fetchMenuCategories]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          '& > *': {},
        }}
      >
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <ButtonGroup variant="outlined" aria-label="category button group">
            {menuCategories.map((category, index) => (
              <CategoryButton theme={theme} key={index} onClick={() => handleCategoryClick(category._id)}>{category.name}</CategoryButton>
            ))}
          </ButtonGroup>
        </ButtonGroup>
      </Box>     
    </>
  );
}

export default CustomerCategoriesBar;