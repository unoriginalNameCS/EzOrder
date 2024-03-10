import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios'


const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: 'Email', width: 130 },
    { field: 'name', headerName: 'Name', width: 130 },
];

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function StaffScrren() {
    const [rows, setRows] = useState([]); 
    const restaurantId = JSON.parse(localStorage.getItem("userInfo")).restaurant
    useEffect(() => {
    axios.get(`http://localhost:5000/api/users/profiles`,{
        headers: {_id: JSON.parse(localStorage.getItem("userInfo"))._id, Authorization: `${getCookie("jwt")}`, restaurantId},
    }).then(res => {
        console.log(res);
        setRows(res.data)
    })
    }, []);
  return (
    <>
        <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
        </div>
    </>
  );
}
