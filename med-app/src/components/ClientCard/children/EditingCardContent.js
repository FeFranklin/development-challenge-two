import React, { useState } from 'react';
import { CardContent, TextField } from '@mui/material';

const EditingCardContent = ({ client }) => {
  const [name, setName] = useState(client?.name || '');
  const [birth, setBirth] = useState(client?.birth || '');
  const [email, setEmail] = useState(client?.email || '');
  const [addr, setAddr] = useState(client?.addr || '');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBirthChange = (e) => {
    setBirth(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAddrChange = (e) => {
    setAddr(e.target.value);
  };

  return (
    <CardContent>
      <TextField
        margin="normal"
        label="Name"
        variant="outlined"
        value={name}
        size="small"
        onChange={handleNameChange}
      />
      <TextField
        margin="normal"
        label="Email"
        variant="outlined"
        value={email}
        size="small"
        onChange={handleEmailChange}
      />
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