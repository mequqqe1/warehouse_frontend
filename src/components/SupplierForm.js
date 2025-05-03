import React, { useState } from 'react';
import api from '../api/api';
import {
  Container, TextField, Button, Typography, Paper, Box
} from '@mui/material';

function SupplierForm() {
  const [formData, setFormData] = useState({ name: '', contact_info: '' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('suppliers/', formData)
      .then(() => alert('Поставщик добавлен'))
      .catch(err => console.error(err));
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>Добавить поставщика</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Название" name="name" value={formData.name} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Контактная информация" name="contact_info" value={formData.contact_info} onChange={handleChange} margin="normal" />
          <Button variant="contained" color="primary" type="submit">Добавить</Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SupplierForm;