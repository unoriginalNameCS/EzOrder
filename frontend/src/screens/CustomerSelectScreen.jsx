import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const CustomerSelectScreen = () => {
  // Get a list of current restaurants

  // Get a list of current unoccupied tables for that restaurant


  return (
    <>
      <h2 style={{ textAlign: "center" }}>Restaurant and Table Selection</h2>
      <Card className="text-center">
        <Card.Header>Please select a restaurant and a table</Card.Header>
        <Card.Body>
          <Card.Title>Restaurant Selection</Card.Title>
          <DropdownButton id="dropdown-basic-button" title="Dropdown button">
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
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
