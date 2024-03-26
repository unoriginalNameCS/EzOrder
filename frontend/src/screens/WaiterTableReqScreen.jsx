import React, { useEffect, useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';

// This page is for wait staff to view their pending customer table requests
const TableRequestsScreen = () => {
  const [newRequests, setNewRequests] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  async function getTableRequests() {
    const response = await fetch(
      `http://localhost:5000/tables/${userInfo.restaurant}/assistance`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const data = await response.json();

    // if 200 there is data, there is customer requests pending
    if (response.status === 200) {
      setNewRequests(data);
    } else if (response.status === 204) {
      // if 204, then no content (there is no customer requests pending)
      console.log("204", data);
    }
  }

  useEffect(() => {
    getTableRequests();
  }, []);

  return (
    <>
      <h2>Pending Table Requests</h2>
      <ListGroup>
        {newRequests.map((req) => 
          <ListGroup.Item variant="danger" key={req._id}>
            Table {req.tableNum} has requested assistance.
          </ListGroup.Item>
        )}
      </ListGroup>
    </>
  );
};

export default TableRequestsScreen;
