import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography, Box } from '@mui/material';
import StockReport from './components/StockReport';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Складской учёт
          </Typography>
          {isAuth ? (
            <>
              <Button color="inherit" component={Link} to="/stock">Остатки</Button>
              <Button color="inherit" onClick={logout}>Выйти</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Войти</Button>
              <Button color="inherit" component={Link} to="/register">Регистрация</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuth(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stock" element={isAuth ? <StockReport /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuth ? "/stock" : "/login"} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
