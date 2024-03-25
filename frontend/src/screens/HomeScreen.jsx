import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav.jsx";
import FormContainer from "../components/FormContainer.jsx";
import EmployeeHomeScreen from "./EmployeeHomeScreen.jsx";
import Card from "react-bootstrap/Card";


// just doing manager home screen for now, just basics
const HomeScreen = () => {
  const userInfo = localStorage.getItem("userInfo");
  const navigate = useNavigate();

  return (
    <>
      {userInfo ? (
        <>
          {" "}
          <EmployeeHomeScreen />
          {/* make a manager/staff dashboard and import it here */}{" "}
        </>
      ) : (
        <>
        <br />
          <Card className="text-center">
            <Card.Header>Welcome to EzOrder</Card.Header>
            <Card.Body>
              <Card.Text>
                Order quick, order easy
              </Card.Text>
              <Card.Title>Customers</Card.Title>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: 1 }}
                onClick={() => {
                  navigate("/customer");
                }}
              >
                Order now
              </Button>
              <br />
              <br />
                <Card.Title>Restaurant accounts</Card.Title>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: 1 }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign In
              </Button>
              <br />
              <Button
                variant="outlined"
                color="primary"
                sx={{ margin: 1 }}
                onClick={() => {
                  navigate("/register");
                }}
              >
                Sign Up
              </Button>
              </Card.Body>
          </Card>
        </>
      )}
    </>
  );
};

export default HomeScreen;
