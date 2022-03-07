import React from 'react';
import { CardContent, TextField, Typography } from '@mui/material';

const EditingCardContent = ({ client, addr, handleAddrChange, birth, handleBirthChange }) => {
  
  return (
    <CardContent>
      <Typography variant="h5" component="div">
        {client?.name || 'name of client'}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {client?.id || 'client id'}
      </Typography>
      <Typography variant="body2">
        Email: {client?.email}
      </Typography>
      <TextField
        margin="normal"
        label="Date of Birth"
        variant="outlined"
        value={birth}
        size="small"
        onChange={handleBirthChange}
      />
      <TextField
        margin="normal"
        label="Address"
        variant="outlined"
        value={addr}
        size="small"
        onChange={handleAddrChange}
      />
    </CardContent>
  );
}

export default EditingCardContent;