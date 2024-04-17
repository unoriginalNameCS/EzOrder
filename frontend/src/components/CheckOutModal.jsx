import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import StyledButton from './StyledButton';
import { toast } from "react-toastify";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '10%',
  boxShadow: 24,
  p: 4,
};

export default function CheckOutModal(props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNum('');
    setExpiry('');
    setCvc('');
    setName('');
  }
  const [num, setNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [focused, setFocused] = useState('');
  
  const handlePay = () => {
    toast.success("Dummy Payment Received!")
    handleClose();
  }
  
  return (
    <div>
      <StyledButton onClick={handleOpen}>Pay Online</StyledButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <div>
            <Cards
              number={num}
              expiry={expiry}
              cvc={cvc}
              name={name}
              focused={focused}
            />
            <form style={{display:'flex', flexDirection:'column', rowGap: '1rem', marginTop:'1rem'}}>
                <Typography variant="h6" color="initial">Total Amount: {props.total}</Typography>
              <TextField
                id='number'
                label='Number'
                value={num}
                onChange={(e) => setNum(e.target.value)}
              />
              <TextField
                id='expiry'
                label='Exipry'
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <TextField
                id='name'
                label='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                id='cvc'
                label='CVC'
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
              <Button onClick={handlePay} variant="contained" color="primary">
                Pay
              </Button>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
