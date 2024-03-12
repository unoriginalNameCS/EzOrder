import React from 'react';
import Button from '@mui/material/Button';
export default function EditButton(props) {
  return (
    <>
      <Button
        variant='contained'
        color='primary'
        sx={{ margin: 1 }}
        onClick={() => {
          props.handleEdit(props.id);
        }}
      >
        Edit
      </Button>
    </>
  );
}
