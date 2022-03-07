import React from 'react';
import { CardContent, Typography } from '@mui/material';

const CustomCardContent = ({ client }) => {
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
        <br />
        Address: {client?.addr}
        <br />
        Date of birth: {client?.birth}
      </Typography>
    </CardContent>
  );
};

export default CustomCardContent;
