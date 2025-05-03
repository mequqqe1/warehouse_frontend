import React, { useState, useEffect } from 'react';
import api from '../api/api';
import {
  Container, Typography, Paper, Box, TextField, Button, MenuItem
} from '@mui/material';

function OrderForm() {
  const [formData, setFormData] = useState({ supplier: '', date: '', status: 'pending' });
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    api.get('suppliers/').then(res => setSuppliers(res.data));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('orders/', formData)
      .then(() => alert('Заказ создан'))
      .catch(err => console.error(err));
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>Создать заказ</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth name="date" label="Дата" type="date" value={formData.date} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField
            select
            fullWidth
            label="Поставщик"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            margin="normal"
          >
            {suppliers.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Статус"
            name="status"
            value={formData.status}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="pending">В ожидании</MenuItem>
            <MenuItem value="received">Получен</MenuItem>
            <MenuItem value="cancelled">Отменён</MenuItem>
          </TextField>
          <Button type="submit" variant="contained">Создать</Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default OrderForm;