import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { toast } from 'react-toastify'


const CustomerSelectScreen = () => {
  const [restaurants, setRestaurants] = useState([])

  // Get a list of current restaurants
  async function getRestaurants () {
    const response = await fetch('http://localhost:5000/tables/restaurants', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
    const data = await response.json();

    // if successfully fetched all restaurants
    if (response.status === 200) {
      setRestaurants(data)
    } else if (response.status === 204) {
      // list of restaurants returned is empty
      setRestaurants(data) // Not sure if I need to do anything 
    } else {
      // Something went wrong
      toast.error(data?.message)
      console.log(data?.message);
    }
  }

  // Get a list of current unoccupied tables for that restaurant

  useEffect(() => {
    getRestaurants()
  }, [])

  return (
    <>
      <br />
      <Card className="text-center">
        <Card.Header>Restaurant and Table Selection</Card.Header>
        <Card.Body>
          <Card.Title>Restaurant Selection</Card.Title>
          <DropdownButton id="dropdown-basic-button" title="Select a restaurant">
            { restaurants.map((restaurant) => 
              <Dropdown.Item key={restaurant.name} >{restaurant.name}</Dropdown.Item>
            )}
          </DropdownButton>
          <Card.Text>
            With supporting text below as a natural lead-in to additional
            content.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
        <Card.Footer className="text-muted">2 days ago</Card.Footer>
      </Card>
    </>
  );
};

export default CustomerSelectScreen;
