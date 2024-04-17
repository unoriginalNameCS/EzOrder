import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SideNav from '../components/SideNav';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material';
import EditStaffModal from '../components/EditStaffModal';
import NewStaffModal from '../components/NewStaffModal';

const StaffScreen = () => {
  
  const [rows, setRows] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const restaurantId = userInfo.restaurant;
  const theme = useTheme();

  const [newStaffModaloOpen, setNewStaffModalOpen] = useState(false);
  const [editStaffModalOpen, setEditStaffModalOpen] = useState(false);

  const handleOpenNewStaffModal = () => {
    setNewStaffModalOpen(true);
  };

  const handleCloseNewStaffModal = () => {
    setNewStaffModalOpen(false);
    refreshStaff();
  };

  const handleOpenEditStaffModal = (staffId) => {
    setSelectedStaff(staffId)
    setEditStaffModalOpen(true);
  };

  const handleCloseEditStaffModal = () => {
    setSelectedStaff('');
    setEditStaffModalOpen(false);
    refreshStaff();
  };

  const fetchProfiles = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/profiles`, {
        headers: {
          _id: userInfo._id,
          Authorization: userInfo.token,
          restaurantId,
        },
      });

      setRows(res.data);
    } catch (error) {
      console.error('Error fetching profiles:', error.response?.data || error.message);
    }
  };

  const deleteStaff = async (staffId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/delete/${staffId}`, 
      {
        headers: {
          _id: userInfo._id,
          Authorization: userInfo.token,
          restaurantId,
        },
      });
      refreshStaff();
    } catch (error) {
      console.error('There was an error deleting the item:', error.response?.data || error.message);
    }
  };

  const handleRemove = async (staffId) => {
    deleteStaff(staffId)
    refreshStaff();
  }

  const refreshStaff = () => {
    fetchProfiles();
  }

  useEffect(() => {
    fetchProfiles();
  }, []);


  return (
    <>
      <SideNav />
      <Grid
        container
        style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: '200px' }}
      >
        <div style={{ height: 400, width: 'auto' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align='left'>Name</TableCell>
                  <TableCell align='left'>Email&nbsp;</TableCell>
                  <TableCell align='left'>Role&nbsp;</TableCell>
                  <TableCell align='left'>Edit&nbsp;</TableCell>
                  <TableCell align='left'>Remove&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      {row.id}
                    </TableCell>
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align='left'>{row.email}</TableCell>
                    <TableCell align='left'>{row.role}</TableCell>
                    <TableCell align='left'>
                      <Button variant='text' color='primary' onClick={() => handleOpenEditStaffModal(row.id)}>
                          Edit
                      </Button>
                    </TableCell>
                    <TableCell align='left'>
                      <Button variant='text' color='primary' onClick={() => handleRemove(row.id)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant='text' color='primary' onClick={handleOpenNewStaffModal}>
            Add New Staff
          </Button>
        </div>
      </Grid>
      <NewStaffModal
        open={newStaffModaloOpen}
        handleClose={handleCloseNewStaffModal}
        restaurantId={restaurantId}
      />
      <EditStaffModal
        open={editStaffModalOpen}
        handleClose={handleCloseEditStaffModal}
        staffId={selectedStaff}
        restaurantId={restaurantId}
      />
    </>
  );
}

export default StaffScreen;