import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewCategoryModal from '../components/NewCategoryModal';
import EditCategoryModal from '../components/EditCategoryModal';
import AddIcon from '@mui/icons-material/Add';
import ReorderIcon from '@mui/icons-material/Reorder';

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

  const EditButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#FBFBF2',
    color: '#83AE0B',
    borderRadius: '0.5rem',
    borderColor: '#83AE0B',
    padding: theme.spacing(0.5), 
    textTransform: 'none',
    boxShadow: 'none', 
    marginLeft: '1rem',
    '&:hover': {
      backgroundColor: '#83AE0B', 
      boxShadow: 'none',
      color: '#FFFFFF',
      borderColor: '#83AE0B'
    },
  }));

  const CategoriesBar = ({restaurantId, userInfo}) => {
    const theme = useTheme();
    const [menuCategories, setMenuCategories] = useState([]); 
    const [modalOpen, setModalOpen] = useState(false); 

    const handleOpenModal = () => {
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
      setModalOpen(false);
      refreshMenuCategories();
    };
  
    const refreshMenuCategories = () => {
      fetchMenuCategories();
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
        } catch (error) {
          console.error('There was an error fetching the categories:', error.response?.data || error.message);
        }
      };
    
    useEffect(() => {
      fetchMenuCategories();
    }, []);

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
              <CategoryButton theme={theme} key={index}>{category.name}</CategoryButton>
            ))}
          </ButtonGroup>
        </ButtonGroup>
        <EditButton
          variant='outlined'
          theme={theme}
          onClick={handleOpenModal}
        >
          <ReorderIcon/>
        </EditButton>
        <EditButton
          variant='outlined'
          theme={theme}
          onClick={handleOpenModal}
        >
          <AddIcon/>
        </EditButton>
      </Box>
      <NewCategoryModal
          open={modalOpen}
          handleClose={handleCloseModal}
          refreshItems={refreshMenuCategories}
          restaurantId={restaurantId} 
      />
      <EditCategoryModal
          open={modalOpen}
          handleClose={handleCloseModal}
          refreshItems={refreshMenuCategories}
          restaurantId={restaurantId} 
          categories={menuCategories}
      />      
    </>
  );
}

export default CategoriesBar;