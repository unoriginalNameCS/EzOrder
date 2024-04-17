import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import EmployeeHomeScreen from "./EmployeeHomeScreen.jsx";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from '@mui/material/MenuList';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HeroImg from "../components/assets/hero.png";
import { styled, alpha } from "@mui/material/styles";
import { Divider, Stack } from "@mui/material";
import { GlobalStyles } from "@mui/material";
import Typist from "react-typist-component";
import { toast } from "react-toastify";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StyledButton = styled(Button)(({ theme, bgColor, hoverColor }) => ({
  backgroundColor: bgColor || "#F19413",
  color: theme.palette.common.white,
  fontFamily: "Fredoka, sans-serif",
  borderRadius: "0.5rem",
  padding: theme.spacing(1.25, 3.25),
  textTransform: "none",
  boxShadow: "none",
  fontSize: "1.25rem",
  width: 300,
  "&:hover": {
    backgroundColor: hoverColor || "#FFAD3C",
    boxShadow: "none",
  },
}));

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 300,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow: theme.shadows[3],
    maxHeight: "calc(70vh - 100px)", // Maximum height of the menu
    overflowY: "auto", // Enable scrolling for the Y axis
    "& .MuiMenu-list": {
      padding: "4px 0",
    },

    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function HeroSection() {
  const [restaurants, setRestaurants] = useState([]);
  const [tables, setTables] = useState([]);
  const [anchorElRest, setAnchorElRest] = useState(null);
  const [anchorElTable, setAnchorElTable] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();

  // Fetch restaurants
  useEffect(() => {
    fetch("http://localhost:5000/tables/restaurants")
      .then((response) => response.json())
      .then((data) => {
        const restaurantArray = Array.isArray(data) ? data : [];
        setRestaurants(restaurantArray);
      })
      .catch((error) => {
        console.error("Failed to fetch restaurants", error);
        toast.error("Failed to fetch restaurants");
      });
  }, []);

  // Fetch tables for selected restaurant
  useEffect(() => {
    if (!selectedRestaurant) return;
    fetch(`http://localhost:5000/tables/${selectedRestaurant._id}/numbers`)
      .then((response) => response.json())
      .then((data) => {
        const availableTables = Array.isArray(data)
          ? data.filter((table) => !table.occupied)
          : [];
        setTables(availableTables);
      })
      .catch((error) => {
        console.error("Failed to fetch tables", error);
        toast.error("Failed to fetch tables");
      });
  }, [selectedRestaurant]);

  const handleRestaurantClick = (event) => {
    setAnchorElRest(event.currentTarget);
  };

  const handleRestaurantClose = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setAnchorElRest(null);
    // Reset tables whenever a new restaurant is selected
    setTables([]);
    setSelectedTable(null);
  };

  const handleTableClick = (event) => {
    if (selectedRestaurant) {
      if (tables.length > 0) {
        setAnchorElTable(event.currentTarget);
      } else {
        toast.warning("No avaliable tables");
      }
    } else {
      toast.info("Please select a restaurant first.");
    }
  };

  const selectTable = async () => {
    if (!selectedRestaurant || !selectedTable) {
      toast.info("Please select both a restaurant and a table.");
      return;
    }
    try {
      // Fetch restaurant details
      const resDetails = await fetch(`http://localhost:5000/restaurants/${selectedRestaurant._id}/details`);
      const restaurantDetails = await resDetails.json();
  
      if (resDetails.status === 200) {
        // Save restaurant details separately in localStorage
        const restaurantInfo = {
          restaurantName: selectedRestaurant.name,
          restaurantId: selectedRestaurant._id,
          logoUrl: restaurantDetails.logoUrl,
          bannerUrl: restaurantDetails.bannerUrl
        };
        localStorage.setItem("restaurantInfo", JSON.stringify(restaurantInfo));
  
        // Fetch and process table selection
        const tableSelectResponse = await fetch(
          `http://localhost:5000/tables/${selectedRestaurant._id}/select`,
          {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ tableNumber: selectedTable.number }),
          }
        );
  
        const tableSelectData = await tableSelectResponse.json();
        if (tableSelectResponse.status === 200) {
          toast.success(`Successfully selected table number ${selectedTable.number}`);
  
          // Save table-related details
          const customerInfo = {
            restaurantId: selectedRestaurant._id,
            tableId: selectedTable._id,
            tableNumber: selectedTable.number,
          };
          localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
          
          // Navigate to customer menu
          navigate(`/customerMenu`);
        } else {
          toast.error(tableSelectData?.message || "Failed to select table");
        }
      } else {
        throw new Error('Failed to fetch restaurant details');
      }
    } catch (error) {
      console.error("Error during table selection", error);
      toast.error(error.message || "An error occurred while selecting the table.");
    }
  };

  const handleTableClose = (table) => {
    setSelectedTable(table);
    setAnchorElTable(null);
  };

  const LeftContent = (
    <Grid
      item
      container
      md={6}
      xs={12}
      justifyContent="center"
      sx={{
        flexGrow: 1,
      }}
    >
      <Stack spacing={4} sx={{ zIndex: 10 }}>
        <Stack spacing={3}>
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
                Select your restaurant & table
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
                Restaurant
              </Typography>
            </Box>
            <StyledButton
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleRestaurantClick}
            >
              {selectedRestaurant
                ? selectedRestaurant.name
                : "Select Restaurant"}
            </StyledButton>
            <StyledMenu
              anchorEl={anchorElRest}
              open={Boolean(anchorElRest)}
              onClose={() => setAnchorElRest(null)}
            >
              {restaurants.map((restaurant, index) => (
                <MenuList>
                  <MenuItem
                    key={restaurant._id}
                    onClick={() => handleRestaurantClose(restaurant)}
                  >
                    {restaurant.name}
                  </MenuItem>
                  {restaurants.length - 1 !== index && (
                    <Divider sx={{ my: 0 }} />
                  )}
                </MenuList>
              ))}
            </StyledMenu>
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
                Table
              </Typography>
            </Box>
            <StyledButton
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleTableClick}
            >
              {selectedTable ? `${selectedTable.number}` : "Select Table"}
            </StyledButton>
            <StyledMenu
              anchorEl={anchorElTable}
              open={Boolean(anchorElTable)}
              onClose={() => setAnchorElTable(null)}
            >
              {tables.map((table, index) => (
                <MenuList>
                  <MenuItem
                    key={table._id}
                    onClick={() => handleTableClose(table)}
                  >
                    {`${table.number}`}
                  </MenuItem>
                  {tables.length - 1 !== index && <Divider sx={{ my: 0 }} />}
                </MenuList>
              ))}
            </StyledMenu>
          </Stack>
        </Stack>
        {selectedRestaurant && selectedTable ? (
          <Stack direction="column" spacing={10}>
            <StyledButton
              onClick={selectTable}
              bgColor="#83AE0B"
              hoverColor="#9acd0d"
            >
              Start Ordering
            </StyledButton>
          </Stack>
        ) : null}
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
          <img alt={""} src={HeroImg} style={{ height: "80%", opacity: 0.6 }} />
        </Box>
      </Stack>
    </Grid>
  );

  return (
    <Grid
      container
      spacing={{ xs: 30, md: 2 }}
      sx={{
        flexGrow: 1,
      }}
    >
      {LeftContent}
      {RightContent}
    </Grid>
  );
}

const CustomerSelectScreen = () => {
  const userInfo = localStorage.getItem("userInfo");
  return (
    <>
      {userInfo ? (
        <EmployeeHomeScreen />
      ) : (
        <>
          <GlobalStyles styles={{ body: { overflowX: "hidden" } }} />
          <Box
            sx={{
              minHeight: "100vh",
              width: "105vw",
              overflowX: "hidden",
              px: 8,
              py: 8,
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

export default CustomerSelectScreen;
