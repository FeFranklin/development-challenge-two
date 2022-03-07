import './styles.scss';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Alert } from '@mui/material';
import { API } from 'aws-amplify';

const Form = ({ defaultName, defaultBirth, defaultEmail, defaultAddr }) => {

  const [name, setName] = useState(defaultName || '');
  const [birth, setBirth] = useState(defaultBirth || '');
  const [email, setEmail] = useState(defaultEmail || '');
  const [addr, setAddr] = useState(defaultAddr || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState(null);

  const apiName = 'medapi';
  const path = '/clients';

  const clearInputs = () => {
    setName('');
    setAddr('');
    setEmail('');
    setBirth('');
  }

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

  const onButtonClick = () => {
    const param = {
      body: {
        name: name,
        email: email,
        addr: addr,
        birth: birth,
      }
    }

    API
      .post(apiName, path, param)
      .then(res => {
        setSuccess(res.success);
        clearInputs();
      })
      .catch(err => {
        console.log(err);
        console.log(typeof err);
        setError(err);
      });
    
  }

  useEffect(() => {
    if (!!success === true) {
      setTimeout(() => setSuccess(''), 5000);
    }

    if (!!error === true) {
      setTimeout(() => setError(''), 5000);
    }

  }, [success, error]);

  return (
    <Stack className='form'>
      <h1 className='form__title'>Patient Register</h1>
      <TextField
        margin="normal"
        label="Name"
        variant="outlined"
        value={name}
        onChange={handleNameChange}
      />  
      <TextField
        margin="normal"
        label="Date of Birth"
        variant="outlined"
        value={birth}
        onChange={handleBirthChange}
      />
      <TextField
        margin="normal"
        label="Email"
        variant="outlined"
        value={email}
        onChange={handleEmailChange}
      />
      <TextField
        margin="normal"
        label="Address"
        variant="outlined"
        value={addr}
        onChange={handleAddrChange}
      />
      {success && <Alert className='form__notification' variant="filled" severity="success">{success}</Alert>}
      {error && <Alert className='form__notification' variant="filled" severity="error">invalid form try again</Alert>}
      <Button onClick={onButtonClick} variant="contained">Register</Button>
    </Stack>
  )
};

export default Form;
