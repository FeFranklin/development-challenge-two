import './styles.scss';
import React, { useState } from 'react';
import { Card, CardActions, Button } from '@mui/material';
import EditingCardContent from './children/EditingCardContent';
import CustomCardContent from './children/CustomCardContent';
import { API } from 'aws-amplify';

const ClientCard = ({ client }) => {
  const [editing, setEditing] = useState(false);
  const { name, email, addr, birth, id } = client;
  const apiName = 'medapi';
  const path = '/clients';

  const handleEditing = () => {
    const param = {
      body: {
        name: name,
        email: email,
        addr: addr,
        birth: birth,
        id: id,
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

  return (
    <Card sx={{ minWidth: 275 }} className='card__container'>
      {editing ? <EditingCardContent client={client} /> : <CustomCardContent client={client} />}
      <CardActions>
        <Button size="small" onClick={handleEditing}>{editing? 'Save' : 'Edit'}</Button>
      </CardActions>
    </Card>
  );
};

export default ClientCard;
