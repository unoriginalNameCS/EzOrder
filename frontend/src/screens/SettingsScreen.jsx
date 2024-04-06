import React from 'react'
import SideNav from '../components/SideNav';
import { styled, useTheme } from '@mui/material/styles';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';

const ImageContainer = styled(CardMedia)(({ theme }) => ({
  width: '10rem',  
  height: '10rem',
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

const SettingsScreen = () => {
  const theme = useTheme();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const restaurantName = userInfo.restaurantName;
  return (
    <>
      <SideNav/>
      <Box 
        component="form" 
        sx={{ width: '100%', minHeight: '100vh'}} 
        style={{ padding: theme.spacing(3), marginLeft: '160px' }}
      > 
        <Typography variant="h5" component="div" sx={{fontWeight: 800, mb: 2}}>
          Restaurant Info
        </Typography>
        <Typography variant="subtitle2" component="div" sx={{fontWeight: 800, mb: -2}}>
          Name
        </Typography>
        <TextField
          margin="normal"
          name="name"
          defaultValue={restaurantName}
          color='success'
          style={{width: '16rem'}}
          size='small'
        />
        <Typography variant="subtitle2" component="div" sx={{fontWeight: 800, mt: 1}}>
          Logo
        </Typography>
        <ImageContainer theme={theme}>
          <StyledImage src={'https://placehold.co/256x256'} alt="Image" />
        </ImageContainer>  
        <StyledButton
            variant="contained"
            sx={{width: '10rem', mt: 1.5}}
        >
         Add Logo
        </StyledButton>
        <Typography variant="subtitle2" component="div" sx={{fontWeight: 800, mt: 2}}>
          Banner
        </Typography>
        <ImageContainer theme={theme} style={{width: '20rem'}}>
          <StyledImage style={{width: '20rem'}} src={'https://placehold.co/512x256'} alt="Image" />
        </ImageContainer>  
        <StyledButton
            variant="contained"
            sx={{width: '10rem', mt: 1.5}}
        >
         Add Banner
        </StyledButton>
      </Box>
    </>
  )
};

export default SettingsScreen;
