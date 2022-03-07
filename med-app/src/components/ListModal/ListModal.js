import './styles.scss';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Box, TextField } from '@mui/material';
import { ClientCard } from '../../components'; 
import { API } from 'aws-amplify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const ListModal = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [client, setClient] = useState(null);

  const apiName = 'medapi';
  const path = '/clients';
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  
  useEffect(() => {
    API
    .get(apiName, '/clients')
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error.response);
    });
  }, []);

  const handleDeletion = (name) => {
    API
      .del(apiName, `${path}/${name}`, {
        body: {
          email: email,
        }
      })
      .then(res => {
        setOpen(false);
        setClient(null);
      })
      .catch(error => {
        console.log(error.response);
      });
  }
  
  useEffect(() => {
    setName('');
    setEmail('');
    setClient(null);
  }, [open]);

  const handleSearch = (name) => {
    API
      .get(apiName, `${path}/${name}/${email}`)
      .then(res => {
        try {
          if (Object.keys(res).length === 0) {
            throw new Error("Empty object");
          }
          setClient(res);
        } catch {
          console.log('Empty object');
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleOpen}>List patient</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} display='flex' flexDirection='column'>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Search patient
          </Typography>
          <TextField
            margin="normal"
            label="Name of patient"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
          />
          <TextField
            margin="normal"
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
          />
          {!!client && (<ClientCard client={client} />)}
          <Button variant="contained" color="secondary" onClick={() => handleSearch(name)}>Search Client</Button>
          <Button variant="contained" color="error" disabled={client === null} onClick={() => handleDeletion(name)}>Delete records</Button>
        </Box>
      </Modal>
    </>
  );
}

export default ListModal;
