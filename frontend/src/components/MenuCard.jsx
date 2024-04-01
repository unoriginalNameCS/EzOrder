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
  objectFit: 'cover', 
  borderRadius: theme.shape.borderRadius,
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minWidth: '25rem',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexGrow: 1,
  marginRight: theme.spacing(1)
}));

const Title = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 400,
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
  fontWeight: 300,
  whiteSpace: 'normal' 
}));

const Ingredients = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1), 
  marginTop: theme.spacing(1),
}));

const Tag = styled(Typography)(({ theme }) => ({
  color: 'white',
  backgroundColor: '#83AE0B',
  borderRadius: theme.shape.borderRadius,
  borderColor: '#83AE0B',
  padding: theme.spacing(0.5, 1),
  fontSize: '0.5rem',
}));

const MenuCard = ({ title, description, price, imageUrl, tags }) => {
  const theme = useTheme();

  return (
    <ItemCard>
      <ImageContainer theme={theme}>
        <StyledImage src={imageUrl} alt="Image" />
      </ImageContainer>
      <ContentContainer>
        <CardContent>
          <Title gutterBottom variant="h5" component="div">
            {title}
          </Title>
          <Description variant="body2">
            {description}
          </Description>
          <Box justifyContent='space-between' alignItems='center' display='flex' flexDirection='' flexGrow='1'>
            <Ingredients>
              {tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </Ingredients>
            <Price variant="h5">
              {price}
            </Price>            
          </Box>
        </CardContent>
      </ContentContainer>
    </ItemCard>
  );
}

export default MenuCard