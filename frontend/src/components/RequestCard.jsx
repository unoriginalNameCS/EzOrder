import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import RequestProgressButton from './RequestProgressButton';

const Request = styled(Card)(({ theme }) => ({
  display: 'inline-flex',
  minWidth: '22rem',
  maxWidth: '100%',
  boxShadow: "none",
  border: `1.5px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  flexDirection: 'column'
}));

const Title = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 400,
});

const Subtext = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  fontWeight: 200,
  whiteSpace: 'normal' 
}));

function formatDate(d) {
  // Create a date object using the MongoDB date string
  const date = new Date(d);

  // Define options for date parts
  const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

  // Get date and time parts
  const dateString = date.toLocaleDateString('en-US', dateOptions).replace(/, /g, ' ');
  const timeString = date.toLocaleTimeString('en-US', timeOptions);

  // Concatenate time and date string
  return `${timeString}, ${dateString}`;
}


const RequestCard = ({requestNumber, tableNumber, time, state, requestId, type, onOrderUpdate}) => {
  const theme = useTheme();
    return (
        <Request>
          <CardContent>
            <Box display="flex" justifyContent="space-between" width="100%" marginBottom={'0.25rem'}>
              <Title variant="h5" component="div" sx={{fontWeight: 800}}>
                Request #{requestNumber}
              </Title>
            </Box>
            <Title variant="h5" component="div" sx={{color: theme.palette.text.secondary, fontWeight: 400}}>
              Table {tableNumber}
            </Title>
            <Subtext variant="subtitle1">
              {formatDate(time)}
            </Subtext>
            <Subtext variant="subtitle2">
              Requesting {type}
            </Subtext>
            <RequestProgressButton orderId={requestId} state={state} onOrderUpdate={onOrderUpdate}/>
          </CardContent>
        </Request>
    )
}

export default RequestCard