import React, { useState, useEffect } from 'react';
import api from '../api/api';
import {
  Container, TextField, Button, MenuItem, Typography, Paper, Box
} from '@mui/material';

function ProductForm() {
  const [formData, setFormData] = useState({ name: '', sku: '', unit: '', category: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('categories/').then(res => setCategories(res.data));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('products/', formData)
      .then(() => alert('Товар добавлен'))
      .catch(err => console.error(err));
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>Добавить товар</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Название" name="name" value={formData.name} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="SKU" name="sku" value={formData.sku} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Единица измерения" name="unit" value={formData.unit} onChange={handleChange} margin="normal" />
          <TextField
            select
            fullWidth
            label="Категория"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" type="submit">Добавить</Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProductForm;