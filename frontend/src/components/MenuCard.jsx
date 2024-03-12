import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';

const ItemCard = styled(Card)(({ theme }) => ({
  display: 'inline-flex',
  maxWidth: '100%',
  boxShadow: "none",
  border: `1.5px solid ${theme.palette.divider}`,
  alignItems: 'center',
  overflow: 'hidden',
}));

const ImageContainer = styled(CardMedia)(({ theme }) => ({
  width: '100px',  
  height: '100px',
  display: 'flex',
  alignItems: 'center', 
  justifyContent: 'center', 
  overflow: 'hidden', 
  borderRadius: theme.shape.borderRadius, 
  margin: '1rem',
  marginRight: '0'
}));


const StyledImage = styled('img')(({ theme }) => ({
  maxHeight: '100%',
  maxWidth: '100%',
  objectFit: 'contain', 
  borderRadius: theme.shape.borderRadius,
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexGrow: 1,
  marginRight: theme.spacing(1)
}));

const Title = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 'bold',
});

const Price = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: theme.typography.fontWeightMedium, 
  textAlign: 'right',
  alignSelf: 'flex-end',
}));


const Description = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  fontWeight: 'light', 
}));

const Ingredients = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1), 
  flexWrap: 'wrap', 
  marginTop: theme.spacing(1),
}));

const Tag = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1),
  fontSize: '0.5rem',
  boxShadow: theme.shadows[1],
}));

export default function MenuCard() {
  const theme = useTheme();
  const dummyImageUrl = 'https://via.placeholder.com/140';

  return (
    <ItemCard>
      <ImageContainer theme={theme}>
        <StyledImage src={dummyImageUrl} alt="Salmon Nigiri" />
      </ImageContainer>
      <ContentContainer>
        <CardContent>
          <Title gutterBottom variant="h5" component="div">
            Salmon Nigiri
          </Title>
          <Description variant="body2">
            A ball of vinegared sushi rice topped with a slice of salmon.
          </Description>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Ingredients>
              <Tag>Rice</Tag>
              <Tag>Rice Vinegar</Tag>
              <Tag>Salmon</Tag>
            </Ingredients>
            <Price variant="h5">
              $5.30
            </Price>            
          </Box>
        </CardContent>
      </ContentContainer>
    </ItemCard>
  );
}
