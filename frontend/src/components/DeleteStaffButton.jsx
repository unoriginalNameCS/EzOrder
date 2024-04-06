import React from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DeleteStaffButton(props) {
  const restaurantId = JSON.parse(localStorage.getItem('userInfo')).restaurant;
  const navigate = useNavigate();
  const handleDelete = () => {
    axios
      .delete(
        `http://localhost:5000/api/users/delete/${props.id}`,
        {
          headers: {
            _id: JSON.parse(localStorage.getItem('userInfo'))._id,
            Authorization: JSON.parse(localStorage.getItem('userInfo')).token,
            restaurantId,
          },
        }
      )
      .then((res) => {
        navigate(0);
      });
    navigate(0);
  };
  return (
    <>
      <Button variant='text' color='primary' onClick={handleDelete}>
        Delete
      </Button>
    </>
  );
}
