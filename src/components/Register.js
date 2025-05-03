import React, { useState } from 'react';
import api from '../api/api';
import {
  Container, TextField, Button, Typography, Paper, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('auth/register/', formData)
      .then(() => navigate('/login'))
      .catch(err => alert('Ошибка регистрации'));
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 3, mt: 8 }}>
        <Typography variant="h5" gutterBottom>Регистрация</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Имя пользователя"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth>Зарегистрироваться</Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;