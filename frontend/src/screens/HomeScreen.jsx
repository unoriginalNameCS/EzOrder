import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import EmployeeHomeScreen from "./EmployeeHomeScreen.jsx";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LeafImg from "../components/assets/leaf.png";
import HeroImg from "../components/assets/hero.png";
import BackdropImg from "../components/assets/Backdrop.png";
import EzOrderLogo from "../components/assets/EzOrder.png";
import { styled, useTheme } from "@mui/material/styles";
import { Divider, Stack } from "@mui/material";
import { GlobalStyles } from "@mui/material";
import BottomNavigation from "@mui/material";
import Typist from "react-typist-component";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";


const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#F19413",
  color: theme.palette.common.white,
  fontFamily: "Fredoka, sans-serif",
  borderRadius: "0.5rem",
  padding: theme.spacing(1.25, 3.25),
  textTransform: "none",
  boxShadow: "none",
  fontSize: "1.25rem",
  width: 200,
  "&:hover": {
    backgroundColor: "#FFAD3C",
    boxShadow: "none",
  },
}));

const SignUpButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#83AE0B",
  color: theme.palette.common.white,
  borderRadius: "0.5rem",
  padding: theme.spacing(1.25, 3.25),
  textTransform: "none",
  boxShadow: "none",
  fontSize: "1.25rem",
  fontFamily: "Fredoka, sans-serif",
  "&:hover": {
    backgroundColor: "#9acd0d",
    boxShadow: "none",
  },
}));

function HeroSection() {
  const navigate = useNavigate();
  const LeftContent = (
    <Grid
      item
      container
      md={6}
      xs={12}
      justifyContent="center"
      alignItems="center"
      sx={{ flexGrow: 1 }}
    >
      <img
        src={BackdropImg}
        style={{
          position: "absolute",
          left: -560,
          opacity: 0.6,
          zIndex: 1,
          width: "2000px",
          height: "auto",
        }}
      />
      <Stack spacing={6} sx={{ zIndex: 10 }}>
        <Stack spacing={3}>
          <Typography
            variant="h1"
            sx={{
              lineHeight: 1.2,
              fontFamily: "Fredoka, sans-serif",
              fontWeight: 600,
              color: "#83AE0B",
              textShadow: "2px 2px 4px white",
            }}
          >
            Welcome to EzOrder
          </Typography>
          <Stack direction="row" alignItems="center" spacing={6}>
            <Typist typingDelay={100}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  fontFamily: "Fredoka, sans-serif",
                  textShadow: "4px 4px 8px #D9D9D9",
                }}
              >
                Order quick, order easy
              </Typography>
            </Typist>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="row" spacing={18}>
          <Stack direction="column" spacing={2}>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 400,
                  fontFamily: "Fredoka, sans-serif",
                  textShadow: "4px 4px 8px #D9D9D9",
                }}
              >
                Staff
              </Typography>
            </Box>
            <StyledButton onClick={() => navigate('/login')}>Log In</StyledButton>
            <SignUpButton onClick={() => navigate('/register')}>Sign Up</SignUpButton>
          </Stack>
          <Stack direction="column" spacing={2}>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 400,
                  fontFamily: "Fredoka, sans-serif",
                  textShadow: "4px 4px 8px #D9D9D9",
                }}
              >
                Customers
              </Typography>
            </Box>
            <StyledButton onClick={() => navigate('/customer')}>Order Now</StyledButton>
          </Stack>
        </Stack>
      </Stack>
    </Grid>
  );

  const RightContent = (
    <Grid
      item
      container
      md={6}
      xs={12}
      justifyContent="center"
      alignItems="center"
      sx={{ flexGrow: 1, position: "relative" }}
    >
      <Stack>
        <Box>
          <img src={HeroImg} style={{ height: "80%", opacity: 0.6 }} />
        </Box>
      </Stack>
    </Grid>
  );

  return (
    <Grid container spacing={{ xs: 30, md: 2 }} sx={{ flexGrow: 1 }}>
      {LeftContent}
      {RightContent}
    </Grid>
  );
}

function Footer() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "12px",
        bgcolor: "background.paper",
        mt: "auto", // pushes the footer to the bottom
        backgroundColor: "#83AE0B",
        zIndex: 100,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          color="white"
          align="center"
          sx={{ fontFamily: "Fredoka, sans-serif" }}
        >
          Follow us on social media
        </Typography>
        <Box sx={{ "& > :not(style)": { mr: 2 } }}>
          <IconButton
            size="large"
            color="primary"
            aria-label="Facebook"
            href="https://facebook.com"
            target="_blank"
          >
            <FacebookIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="large"
            color="info"
            aria-label="Twitter"
            href="https://twitter.com"
            target="_blank"
          >
            <TwitterIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="large"
            color="secondary"
            aria-label="Instagram"
            href="https://instagram.com"
            target="_blank"
          >
            <InstagramIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="large"
            color="info"
            aria-label="LinkedIn"
            href="https://linkedin.com"
            target="_blank"
          >
            <LinkedInIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="large"
            color="error"
            aria-label="YouTube"
            href="https://youtube.com"
            target="_blank"
          >
            <YouTubeIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

const HomeScreen = () => {
  const theme = useTheme();
  const userInfo = localStorage.getItem("userInfo");
  return (
    <>
      {userInfo ? (
        <EmployeeHomeScreen />
      ) : (
        <>
          <GlobalStyles styles={{ body: { overflow: "hidden" } }} />
          <Box
            sx={{
              minHeight: "100vh",
              width: "105vw",
              overflowX: "hidden",
              px: 8,
              py: 0,
              bgcolor: "#FBFBF2",
              display: "flex",
              flexDirection: "column",
              rowGap: 4,
            }}
          >
            <HeroSection />
            {/*<Footer/>*/}
          </Box>
          
        </>
      )}
    </>
  );
};

export default HomeScreen;
