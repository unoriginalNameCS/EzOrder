import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import CustomerSideNav from "../components/CustomerSideNav";
import MenuCard from "../components/MenuCard";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import CustomerCategoriesBar from "../components/CustomerCategoriesBar";
import CustomerItemModal from "../components/CustomerItemModal";
import StyledButton from "../components/StyledButton";

// Screen for customer menu
const CustomerMenuScreen = () => {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [itemModalOpen, setItemModalOpen] = useState(false); // State for controlling the modal
  const navigate = useNavigate();

  const [selectedItemId, setSelectedItemId] = useState("");

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const restaurantInfo = JSON.parse(localStorage.getItem('restaurantInfo'));
  const restaurantId = restaurantInfo.restaurantId;
  const tableId = customerInfo.tableId;

  const onCategorySelected = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleOpenItemModal = (itemId) => {
    setSelectedItemId(itemId);
    setItemModalOpen(true);
  };

  const handleCloseItemModal = () => {
    setSelectedItemId("");
    setItemModalOpen(false);
  };

  // De-selects the table that the customer is at
  const clearTable = async () => {
    const response = await fetch(
      `http://localhost:5000/tables/${customerInfo.restaurantId}/deselect`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          tableNumber: customerInfo.tableNumber,
        }),
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      // successfully deselected the table
      toast.success("Bye for now");
    } else {
      toast.error(data?.message);
    }
  };

  // remove customerInfo from localStorage and redirect back to home
  const handleExit = () => {
    // can add some logic checks if we want such as
    /* if hasNotRequestedBill & hasNotOrdered 
        toast.error(Request the bill first) 
        else {
          removeItem
          navigate()
        }  
      */
    // de-select the table
    clearTable();
    localStorage.removeItem("customerInfo");
    localStorage.removeItem("restaurantInfo");
    navigate("/");
  };

  const fetchMenuCategories = async () => {
    try {
      const url = `http://localhost:5000/customermenus/${restaurantId}/${tableId}/menu/categories`;
      const { data } = await axios.get(url, {
        // headers: {
        //   Authorization: `${userInfo.token}`,
        // },
        // Need to add authorization to check if tableId has restuarantId
      });
      setMenuCategories(data);
      if (data.length > 0) {
        setSelectedCategoryId(data[0]._id); // Set the first category as default
      }
    } catch (error) {
      console.error(
        "There was an error fetching the categories:",
        error.response?.data || error.message
      );
    }
  };

  const fetchMenuItems = async () => {
    try {
      const url = `http://localhost:5000/customermenus/${restaurantId}/${tableId}/menu/categories/${selectedCategoryId}/items`;

      const { data } = await axios.get(url, {
        // headers: {
        //   Authorization: `${userInfo.token}`,
        // },
        // Need to add authorization to check if tableId has restuarantId
      });

      setMenuItems(data);
    } catch (error) {
      console.error(
        "There was an error fetching the menu items:",
        error.response?.data || error.message
      );
    }
  };

  const requestAssistance = async () => {
    try {
      const url = `http://localhost:5000/tables/${restaurantId}/${tableId}/assistance`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          requestedBill: false,
        }),
      });

      if (response.status === 201) {
        toast.success("Requesting Assistance");
      } else if (response.status === 204) {
        toast.error("Invalid, please wait untill current request is completed");
      }
    } catch (error) {
      console.error(
        "There was an error fetching the menu items:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchMenuCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchMenuItems(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  return (
    <div style={{ display: "flex" }}>
      <CustomerSideNav />
      <Grid
        container
        style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: "200px" }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 800, m: 2, ml: 1 }}
        >
          {restaurantInfo.restaurantName}
        </Typography>
        <Grid item xs={12} style={{ padding: theme.spacing(1) }}>
          <CustomerCategoriesBar
            restaurantId={restaurantId}
            customerInfo={customerInfo}
            onCategorySelected={onCategorySelected}
          />
        </Grid>
        {menuItems.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
            key={index}
            style={{ padding: theme.spacing(1) }}
          >
            <Button
              onClick={() => handleOpenItemModal(item._id)}
              style={{
                width: "100%",
                padding: 0,
                textTransform: "none",
                textAlign: "left",
              }}
            >
              <MenuCard
                title={item.name}
                description={item.description}
                price={item.price.toFixed(2)}
                imageUrl={item.imageUrl || "https://via.placeholder.com/140"}
                tags={item.ingredients}
              />
            </Button>
          </Grid>
        ))}
        <Box width={"100%"}>
          <StyledButton sx={{ margin: 1 }} onClick={() => requestAssistance()}>
            Request Assistance
          </StyledButton>
          <StyledButton
            sx={{ margin: 1 }}
            onClick={() => handleExit()}
            bgcolor="#83AE0B"
            hovercolor="#9acd0d"
          >
            Finish Ordering
          </StyledButton>
        </Box>
      </Grid>
      {/* Render the modal */}
      <CustomerItemModal
        open={itemModalOpen}
        handleClose={handleCloseItemModal}
        customerInfo={customerInfo}
        categoryId={selectedCategoryId}
        itemId={selectedItemId}
      />
    </div>
  );
};

export default CustomerMenuScreen;
