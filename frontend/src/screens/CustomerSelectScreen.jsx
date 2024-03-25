import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { toast } from "react-toastify";

const CustomerSelectScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(
    "Select a restaurant"
  );

  // Get a list of current restaurants
  async function getRestaurants() {
    const response = await fetch("http://localhost:5000/tables/restaurants", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    // if successfully fetched all restaurants
    if (response.status === 200) {
      setRestaurants(data);
    } else if (response.status === 204) {
      // list of restaurants returned is empty
      setRestaurants(data); // Not sure if I need to do anything
    } else {
      // Something went wrong
      toast.error(data?.message);
      console.log(data?.message);
    }
  }

  // Get a list of current unoccupied tables for that restaurant
  async function getTables(restaurantId) {
    const response = await fetch(
      `http://localhost:5000/tables/${restaurantId}/numbers`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const data = await response.json();

    // if successfully fetched all restaurants
    if (response.status === 200) {
      setTables(data);
    } else {
      // Something went wrong, most likely that restaurant has no tables (i.e manager has to add tables to their restaurant)
      toast.error(data?.message);
      console.log(data?.message);
    }
  }

  const onClickHandlerRestaurantSelect = (restaurantId, restaurantName) => {
    getTables(restaurantId);
    setSelectedRestaurant(restaurantName);
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <>
      <br />
      <Card className="text-center">
        <Card.Header>Restaurant and Table Selection</Card.Header>
        <Card.Body>
          <Card.Title>Restaurant Selection</Card.Title>
          <DropdownButton id="restaurant-select" title={selectedRestaurant}>
            {restaurants.map((restaurant) => (
              <Dropdown.Item
                key={restaurant.name}
                onClick={() =>
                  onClickHandlerRestaurantSelect(
                    restaurant._id,
                    restaurant.name
                  )
                }
              >
                {restaurant.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <br />
          <Card.Title>Table Selection</Card.Title>
          <DropdownButton id="table-select" title="Select a table">
            {/* If tables === [] i.e the list of tables is empty */}
            {tables.length === 0 ? (
              <Dropdown.Item key="nothing">There are no tables</Dropdown.Item>
            ) : (
              tables.map((table) => (
                <Dropdown.Item className={table.occupied ? "disabled" : ""} key={table.number}>{table.number}</Dropdown.Item>
              ))
            )}
          </DropdownButton>
          <br />
          <br />
          <Button variant="primary">Select restaurant and table</Button>
        </Card.Body>
        <Card.Footer className="text-muted">Scan the QR code at your table to skip this</Card.Footer>
      </Card>
    </>
  );
};

export default CustomerSelectScreen;
