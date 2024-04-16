import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme, bgColor, hoverColor }) => ({
  backgroundColor: bgColor || "#F19413",
  color: theme.palette.common.white,
  borderRadius: "0.5rem",
  padding: theme.spacing(1.25, 3.75),
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: hoverColor || "#FFAD3C",
    boxShadow: "none",
  },
}));

export default StyledButton;
