import React, { useEffect, useState } from 'react';
import api from '../api/api';
import {
  Container, Typography, List, ListItem, ListItemText, Paper
} from '@mui/material';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    api.get('suppliers/')
      .then(res => setSuppliers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Список поставщиков</Typography>
      <Paper>
        <List>
          {suppliers.map(s => (
            <ListItem key={s.id} divider>
              <ListItemText primary={s.name} secondary={s.contact_info} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default SupplierList;