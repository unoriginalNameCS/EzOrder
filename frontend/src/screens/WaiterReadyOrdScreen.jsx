import React, { useEffect, useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';

// This page is for wait staff to view their pending customer table requests
const ReadyToServeOrdersScreen = () => {
  const [newCompletedOrders, setNewCompletedOrders] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  async function getCompletedOrders() {
    const response = await fetch(
      `http://localhost:5000/orders/${userInfo.restaurant}/completedOrders`,
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
      setNewCompletedOrders(data);
    } else if (response.status === 204) {
      // if 204, then no content (there is no customer requests pending)
      console.log("204", data);
    }
  }

  useEffect(() => {
    getCompletedOrders();
  }, []);

  return (
    <>
      <h2>Ready To Serve Orders</h2>
      <ListGroup>
        {newCompletedOrders.map((order) => 
          <ListGroup.Item variant="danger" key={order._id}>
            Order is ready to serve to ${order.tableNum}.
          </ListGroup.Item>
        )}
      </ListGroup>
    </>
  );
};

export default ReadyToServeOrdersScreen;
