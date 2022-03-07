import './styles.scss';
import React, { useState } from 'react';
import { Card, CardActions, Button } from '@mui/material';
import EditingCardContent from './children/EditingCardContent';
import CustomCardContent from './children/CustomCardContent';
import { API } from 'aws-amplify';

const ClientCard = ({ client }) => {
  const { name, email, addr, birth } = client;
  const [editing, setEditing] = useState(false);
  const [birthField, setBirthField] = useState(birth || '');
  const [addrField, setAddrField] = useState(addr || '');

  const handleBirthChange = (e) => {
    setBirthField(e.target.value);
  };

  const handleAddrChange = (e) => {
    setAddrField(e.target.value);
  };

  
  const apiName = 'medapi';
  const path = '/clients';

  const handleEditing = () => {
    const param = {
      body: {
        name: name,
        email: email,
        addr: addrField,
        birth: birthField,
      }
    }

    if(editing) {
      API.put(apiName, path, param)
      .then(result => {
        console.log(result);
      }).catch(err => {
        console.log(err);
      })
      setEditing(prevState => !prevState);
    } else {
      setEditing(prevState => !prevState);
    }
  }

  const handleCancelEditing = () => {
    setEditing(false);
  }

  return (
    <Card sx={{ minWidth: 275 }} className='card__container'>
      {editing ? (
          <EditingCardContent
            birth={birthField}
            handleBirthChange={handleBirthChange}
            addr={addrField}
            handleAddrChange={handleAddrChange}
            client={client}
          />
        ) : (
          <CustomCardContent client={client} />
        )}
      <CardActions>
        <Button size="small" onClick={handleEditing}>{editing? 'Save' : 'Edit'}</Button>
        {editing && <Button size="small" onClick={handleCancelEditing}>Cancel</Button>}
      </CardActions>
    </Card>
  );
};

export default ClientCard;
