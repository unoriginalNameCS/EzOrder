import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  marginTop: 8,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

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
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const navigate = useNavigate();
  const restaurantId = JSON.parse(localStorage.getItem('userInfo')).restaurant;
  const handleCreate = () => {
    axios
      .post(
        'http://localhost:5000/api/users/registerStaff',
        {
          name,
          password,
          email,
          role,
        },
        {
          headers: {
            _id: JSON.parse(localStorage.getItem('userInfo'))._id,
            Authorization: `${getCookie('jwt')}`,
            restaurantId,
          },
        }
      )
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          console.log('success');
          setEmail('');
          setName('');
          setRole('');
          setPassword('');
          setOpen1(false);
          navigate('/staff');
        }
      });
  };
  const handleEdit = (id) => {
    axios
      .put(
        'http://localhost:5000/api/users/profile',
        {
          id,
          name,
          password,
          email,
        },
        {
          headers: {
            _id: JSON.parse(localStorage.getItem('userInfo'))._id,
            Authorization: `${getCookie('jwt')}`,
            restaurantId,
          },
        }
      )
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          console.log('success');
          setEmail('');
          setName('');
          setRole('');
          setPassword('');
          setOpen2(false);
          navigate('/staff');
        }
      });
  };
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/profiles`, {
        headers: {
          _id: JSON.parse(localStorage.getItem('userInfo'))._id,
          Authorization: `${getCookie('jwt')}`,
          restaurantId,
        },
      })
      .then((res) => {
        console.log(res);
        setRows(res.data);
      });
  }, []);
  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align='right'>Name</TableCell>
                <TableCell align='right'>Email&nbsp;</TableCell>
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
                  <TableCell align='right'>{row.name}</TableCell>
                  <TableCell align='right'>{row.email}</TableCell>
                  <TableCell align='right'>
                    <Button
                      variant='text'
                      color='primary'
                      onClick={handleOpen2}
                    >
                      Edit
                    </Button>{' '}
                    <Modal
                      open={open2}
                      onClose={handleClose2}
                      aria-labelledby='modal-modal-title'
                      aria-describedby='modal-modal-description'
                    >
                      <Box sx={style}>
                        <Typography
                          variant='h6'
                          color='initial'
                          sx={{ margin: 1 }}
                        >
                          Edit Staff
                        </Typography>
                        <TextField
                          required
                          id='outlined-required'
                          label='name'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          sx={{ margin: 1 }}
                        />
                        <TextField
                          required
                          id='outlined-required'
                          label='email'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={{ margin: 1 }}
                        />
                        <TextField
                          required
                          id='outlined-required'
                          label='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          sx={{ margin: 1 }}
                        />
                        <Button
                          variant='contained'
                          color='primary'
                          sx={{ margin: 1 }}
                          onClick={()=>{handleEdit(row.id)}}
                        >
                          Edit
                        </Button>
                      </Box>
                    </Modal>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant='text' color='primary' onClick={handleOpen1}>
          Add New Staff
        </Button>
        <Modal
          open={open1}
          onClose={handleClose1}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <Typography variant='h6' color='initial' sx={{ margin: 1 }}>
              Add New Staff
            </Typography>
            <TextField
              required
              id='outlined-required'
              label='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ margin: 1 }}
            />
            <TextField
              required
              id='outlined-required'
              label='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ margin: 1 }}
            />
            <TextField
              required
              id='outlined-required'
              label='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ margin: 1 }}
            />
            <TextField
              required
              id='outlined-required'
              label='role'
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ margin: 1 }}
            />

            <Button
              variant='contained'
              color='primary'
              sx={{ margin: 1 }}
              onClick={handleCreate}
            >
              Create
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
}