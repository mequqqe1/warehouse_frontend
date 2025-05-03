import React, { useState } from 'react';
import api from '../api/api';
import {
  Container, TextField, Button, Typography, Paper, Box, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('auth/token/', credentials)
      .then(res => {
        localStorage.setItem('token', res.data.access);
        onLogin();
        navigate('/stock');
      })
      .catch(err => alert('Ошибка входа'));
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 3, mt: 8 }}>
        <Typography variant="h5" gutterBottom>Вход</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Имя пользователя"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Пароль"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth>Войти</Button>
          <Box textAlign="center" mt={2}>
            <Link href="/register" underline="hover">Нет аккаунта? Зарегистрироваться</Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;