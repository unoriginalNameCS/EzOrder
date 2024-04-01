import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import MenuCard from './MenuCard';

const Order = styled(Card)(({ theme }) => ({
  display: 'inline-flex',
  minWidth: '22rem',
  maxWidth: '100%',
  boxShadow: "none",
  border: `1.5px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  flexDirection: 'column'
}));

const ItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const ImageContainer = styled(CardMedia)(({ theme }) => ({
  width: '120px',  
  height: '120px',
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

const Title = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 400,
});

const Subtext = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  fontWeight: 200,
  whiteSpace: 'normal' 
}));



const OrderCard = () => {
  const theme = useTheme();
    return (
        <Order>
          <CardContent>
            <Box display="flex" justifyContent="space-between" width="100%" marginBottom={'0.25rem'}>
              <Title variant="h5" component="div" sx={{fontWeight: 800}}>
                Order #349
              </Title>
              <Subtext variant="subtitle2" sx={{textAlign: 'right', alignSelf: 'flex-end'}}>
                X3 Items
              </Subtext>
            </Box>
            <Title variant="h5" component="div" sx={{color: theme.palette.text.secondary, fontWeight: 400}}>
              Table 3
            </Title>
            <Subtext variant="subtitle1">
              29 Feb 2024, 08:28 PM
            </Subtext>
            <ItemContainer>
              <ImageContainer theme={theme}>
                <StyledImage src={'https://via.placeholder.com/256'} alt="Image" />
              </ImageContainer>  
              <Box display="flex" flexDirection="column" width="100%">
                <Title>
                  Salmon Nirigi
                </Title>
                <Subtext variant="subtitle2" sx={{}}>
                  No seafood please
                </Subtext>
                <Box display="flex" justifyContent="space-between" marginTop={'0.25rem'}>
                  <Title variant="h5" sx={{fontSize: '0.875rem'}}>
                    $5.00
                  </Title>
                  <Title variant="h5" sx={{fontSize: '0.875rem', textAlign: 'right', alignSelf: 'flex-end'}}>
                    Qty: 1
                  </Title>
                </Box>
              </Box>
            </ItemContainer>
            <Box sx={{
              mt: -2,
              height: '1.55px', // Line thickness
              backgroundColor: theme.palette.divider, // Line color
              width: '100%', // Line width
              alignSelf: 'center', // Aligns the line in the center if needed
            }} />
          </CardContent>
        </Order>
    )
}

export default OrderCard