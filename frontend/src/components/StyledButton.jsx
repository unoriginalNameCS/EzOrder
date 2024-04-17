import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme, bgcolor, hovercolor }) => ({
  backgroundColor: bgcolor || "#F19413",
  color: theme.palette.common.white,
  borderRadius: "0.5rem",
  padding: theme.spacing(1.25, 3.75),
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: hovercolor || "#FFAD3C",
    boxShadow: "none",
  },
}));

export default StyledButton;
