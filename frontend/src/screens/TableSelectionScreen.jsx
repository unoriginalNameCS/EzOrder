import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material';
import SideNav from '../components/SideNav';
import { Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function TableSelectionScreen() {
  const [table, setTable] = React.useState(0);
  const theme = useTheme();
  const navigate = useNavigate();
  const handleChange = (event) => {
    setTable(event.target.value);
  };

  const handleNext = () => {
    navigate('/menu')
  }

  return (
    <>
      <SideNav />
      <Grid
        container
        style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: '200px', display: 'flex',  alignItems: 'center', marginTop:'30%', justifyContent: 'center', flexFlow: 'wrap'}}
      >
        <Box sx={{ minWidth: 500 , display: 'flex', flexDirection:'column', alignItems: 'flex-start'}}>
        <Typography variant="h3" color="initial" sx={{flexGrow: '5'}}>Select a table number: <br></br></Typography>
          <FormControl fullWidth sx={{marginTop:'30px'}}>
            <InputLabel id='demo-simple-select-label'>Table</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={table}
              label='Table'
              onChange={handleChange}
            >
              {Array.from({length: 10}, (_, i) => i + 1).map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" sx={{marginTop:'30px'}} onClick={handleNext}>
          Next
        </Button>
        </Box>
      </Grid>
    </>
  );
}
