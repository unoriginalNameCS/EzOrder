import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideNav from '../components/SideNav';
import { styled, useTheme } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CardMedia from '@mui/material/CardMedia';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from "react-toastify";

const ImageContainer = styled(CardMedia)(({ theme }) => ({
  width: '10rem',
  height: '8rem',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
}));

const StyledImage = styled('img')(({ theme }) => ({
  maxHeight: '100%',
  maxWidth: '100%',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

const BannerContainer = styled(CardMedia)(({ theme }) => ({
  width: '30rem',
  height: '10rem',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
}));

const StyledBanner = styled('img')(({ theme }) => ({
  maxHeight: '100%',
  maxWidth: '100%',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'imageuploaded',
})(({ theme, imageuploaded }) => ({
  backgroundColor: imageuploaded ? '#83AE0B' : '#F19413',
  color: theme.palette.common.white,
  borderRadius: '0.5rem',
  padding: theme.spacing(1.25, 3.25),
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: imageuploaded ? '#9acd0d' : '#FFAD3C',
    boxShadow: 'none',
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const SettingsScreen = () => {
  const theme = useTheme();
  const [restaurantDetails, setRestaurantDetails] = useState({
    name: '',
    logoUrl: '',
    bannerUrl: '',
  });
  const [newName, setNewName] = useState('');
  const [newLogo, setNewLogo] = useState('');
  const [newBanner, setNewBanner] = useState('');

  const [logoTimeout, setLogoTimeout] = useState(null);
  const [bannerTimeout, setBannerTimeout] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openCartDialog, setOpenCartDialog] = useState(false);  
  const [openTableDialog, setOpenTableDialog] = useState(false);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const restaurantId = userInfo.restaurant;

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);
  
  useEffect(() => {
    // Clean up timeouts when the component unmounts or when a new file is selected
    return () => {
      if (logoTimeout) clearTimeout(logoTimeout);
      if (bannerTimeout) clearTimeout(bannerTimeout);
    };
  }, [logoTimeout, bannerTimeout]);

  const updateRestaurantDetail = async (urlDetail, bodyDetail, value) => {
    try {
      const url = `http://localhost:5000/restaurants/${restaurantId}/${urlDetail}`;
      const body = { [bodyDetail]: value };
      const response = await axios.put(url, body, { headers: { Authorization: `${userInfo.token}` } });
      toast.success(response.data.message)
      fetchRestaurantDetails();

      if (urlDetail === 'logoUrl') {
        setNewLogo(value);
        const newTimeout = setTimeout(() => setNewLogo(''), 2500);
        setLogoTimeout(newTimeout);
      } else if (urlDetail === 'bannerUrl') {
        setNewBanner(value);
        const newTimeout = setTimeout(() => setNewBanner(''), 2500);
        setBannerTimeout(newTimeout);
      }
    } catch (error) {
      console.error(`There was an error updating the restaurant ${urlDetail}:`, error.response?.data || error.message);
      toast.error(error.response?.data || error.message);
    }
  };

  const handleFileChange = async (urlDetail, bodyDetail, event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected.');
      return;
    }
    event.target.value = ''; 
    try {
      const dataUrl = await convertFileToDataUrl(file);
      updateRestaurantDetail(urlDetail, bodyDetail, dataUrl);

    } catch (error) {
      console.error(error);
    }
  };
  
  const handleNameChange = (e) => {
    setNewName(e.target.value); 
  };
  
  const handleNameUpdate = () => {
    updateRestaurantDetail('name', 'restaurantName', newName);
  };

  const fetchRestaurantDetails = async () => {
    try {
      const url = `http://localhost:5000/restaurants/${restaurantId}/details`;
      const { data } = await axios.get(url, { headers: { Authorization: `${userInfo.token}` } });
      setRestaurantDetails(data);
      setNewName(data.name);
    } catch (error) {
      console.error('There was an error fetching the restaurant details:', error.response?.data || error.message);
    }
  };


  function convertFileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClearRequests = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/requests/${restaurantId}/clearRequests`, {
        headers: {
          Authorization: `${userInfo.token}`,
        },
      });
      toast.success(response.data.message);
      // Optionally, you can update the state or perform any other actions after clearing requests
    } catch (error) {
      console.error('Error clearing requests:', error.response?.data || error.message);
      toast.error(error.response?.data || error.message);
    }
    // Close the confirmation dialog after clearing requests
    handleCloseDialog();
  };

  const handleOpenOrderDialog = () => {
    setOpenOrderDialog(true);
  };

  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
  };

  const handleClearOrders = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/orders/${restaurantId}/clearOrders`, {
        headers: {
          Authorization: `${userInfo.token}`,
        },
      });
      toast.success(response.data.message);
      // Optionally, you can update the state or perform any other actions after clearing requests
    } catch (error) {
      console.error('Error clearing orders:', error.response?.data || error.message);
      toast.error(error.response?.data || error.message);
    }
    handleCloseOrderDialog();
  };

  const handleOpenCartDialog = () => {
    setOpenCartDialog(true);
  };

  const handleCloseCartDialog = () => {
    setOpenCartDialog(false);
  };

  const handleClearCartItems = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/tables/${restaurantId}/clearCarts`, {
        headers: {
          Authorization: `${userInfo.token}`,
        },
      });
      toast.success(response.data.message);
      // Optionally, you can update the state or perform any other actions after clearing requests
    } catch (error) {
      console.error('Error clearing cart:', error.response?.data || error.message);
      toast.error(error.response?.data || error.message);
    }
    handleCloseCartDialog();
  };

  const handleOpenTableDialog = () => {
    setOpenTableDialog(true);
  };

  const handleCloseTableDialog = () => {
    setOpenTableDialog(false);
  };

  const handleResetTable = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/tables/${restaurantId}/resetTables`, {
        headers: {
          Authorization: `${userInfo.token}`,
        },
      });
      toast.success(response.data.message);
      // Optionally, you can update the state or perform any other actions after clearing requests
    } catch (error) {
      console.error('Error resetting tables:', error.response?.data || error.message);
      toast.error(error.response?.data || error.message);
    }
    handleCloseTableDialog();
  };

  return (
    <>
      <SideNav />
      <Box component="form" sx={{ width: '100%', minHeight: '100vh' }} style={{ padding: theme.spacing(3), marginLeft: '160px' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 800, mb: 2 }}>
          Restaurant Info
        </Typography>
        <Typography variant="subtitle2" component="div" sx={{ fontWeight: 800, mb: -2 }}>
          Name
        </Typography>
        <TextField
          margin="normal"
          name="name"
          value={newName}
          onChange={handleNameChange}
          onBlur={handleNameUpdate}
          color="success"
          style={{ width: '16rem' }}
          size="small"
        />
        <Typography variant="subtitle2" component="div" sx={{ fontWeight: 800, mt: 1 }}>
          Logo
        </Typography>
        <ImageContainer theme={theme}>
          <StyledImage src={restaurantDetails.logoUrl || 'https://placehold.co/256x256'} alt="Logo" />
        </ImageContainer>
        <StyledButton 
          component="label" 
          role={undefined} 
          sx={{ mt: 1.5 }} 
          tabIndex={-1} 
          startIcon={newLogo ? <CheckCircleIcon /> : <CloudUploadIcon />}
          imageuploaded={!!newLogo}
        >
          {newLogo ? "Upload Success" : "Upload Logo"}
          <VisuallyHiddenInput 
            type="file" 
            label="Image" 
            name="image" 
            accept=".jpeg, .png, .jpg" 
            onChange={(e) => handleFileChange('logoUrl', 'logoUrl', e)} 
          />
        </StyledButton>
        <Typography variant="subtitle2" component="div" sx={{ fontWeight: 800, mt: 2 }}>
          Banner
        </Typography>
        <BannerContainer theme={theme}>
          <StyledBanner src={restaurantDetails.bannerUrl || 'https://placehold.co/512x256'} alt="Banner" />
        </BannerContainer>
        <StyledButton 
          component="label" 
          role={undefined} 
          sx={{ mt: 1.5 }} 
          tabIndex={-1} 
          startIcon={newBanner ? <CheckCircleIcon /> : <CloudUploadIcon />}
          imageuploaded={!!newBanner}
        >
          {newBanner ? "Upload Success" : "Upload Banner"}
          <VisuallyHiddenInput 
            type="file" 
            label="Image" 
            name="image" 
            accept=".jpeg, .png, .jpg" 
            onChange={(e) => handleFileChange('bannerUrl', 'bannerUrl', e)}
          />
        </StyledButton>
      </Box>
      <Box component="form" sx={{ width: '100%' }} style={{ padding: theme.spacing(3), marginLeft: '160px' }}>
      <Button onClick={handleOpenDialog} variant="contained" color="error" sx={{ mt: 2 }}>
          Clear Requests
        </Button>

        {/* Button to clear orders */}
        <Button onClick={handleOpenOrderDialog} variant="contained" color="error" sx={{ mt: 2 }}>
          Clear Orders
        </Button>

        {/* Button to clear cart items */}
        <Button onClick={handleOpenCartDialog} variant="contained" color="error" sx={{ mt: 2 }}>
          Clear Cart Items
        </Button>

        {/* Button to reset tables */}
        <Button onClick={handleOpenTableDialog} variant="contained" color="error" sx={{ mt: 2 }}>
          Reset Tables
        </Button>

        {/* Confirmation dialog for clearing requests */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Clear Requests</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to clear all requests?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClearRequests} color="error">
              Clear Requests
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation dialog for clearing orders */}
        <Dialog open={openOrderDialog} onClose={handleCloseOrderDialog}>
          <DialogTitle>Confirm Clear Orders</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to clear all orders?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOrderDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClearOrders} color="error">
              Clear Orders
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation dialog for clearing cart items */}
        <Dialog open={openCartDialog} onClose={handleCloseCartDialog}>
          <DialogTitle>Confirm Clear Cart Items</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to clear all cart items?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCartDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClearCartItems} color="error">
              Clear Cart Items
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Confirmation dialog for resetting tables*/}
        <Dialog open={openTableDialog} onClose={handleCloseTableDialog}>
          <DialogTitle>Confirm Reset Tables</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to reset all tables?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTableDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleResetTable} color="error">
              Reset Tables
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default SettingsScreen;
