import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import {
  Container, Typography, Paper, List, ListItem, ListItemText, TextField, Button, Box, MenuItem, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [newItem, setNewItem] = useState({ product: '', quantity: '', price: '' });

  const fetchOrder = () => {
    api.get(`orders/${id}/`).then(res => setOrder(res.data));
  };

  useEffect(() => {
    fetchOrder();
    api.get('products/').then(res => setProducts(res.data));
  }, [id]);

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    api.post('items/', { ...newItem, order: id })
      .then(() => {
        setNewItem({ product: '', quantity: '', price: '' });
        fetchOrder();
      })
      .catch(err => console.error(err));
  };

  const handleDeleteItem = (itemId) => {
    api.delete(`items/${itemId}/`)
      .then(fetchOrder)
      .catch(err => console.error(err));
  };

  if (!order) return <Typography>Загрузка...</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Заказ #{order.id}</Typography>
      <Typography variant="subtitle1">Дата: {order.date}</Typography>
      <Typography variant="subtitle1">Поставщик: {order.supplier}</Typography>
      <Typography variant="subtitle1">Статус: {order.status}</Typography>
      <Typography variant="h6" sx={{ mt: 3 }}>Товары в заказе:</Typography>
      <Paper sx={{ mb: 3 }}>
        <List>
          {order.items.map((item, index) => (
            <ListItem key={index} divider
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDeleteItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`Продукт ID: ${item.product}`}
                secondary={`Кол-во: ${item.quantity}, Цена: ${item.price}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Typography variant="h6">Добавить товар в заказ</Typography>
      <Paper sx={{ p: 2 }}>
        <Box component="form" onSubmit={handleAddItem}>
          <TextField
            select
            label="Продукт"
            name="product"
            value={newItem.product}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Количество"
            name="quantity"
            value={newItem.quantity}
            onChange={handleChange}
            fullWidth
            type="number"
            margin="normal"
          />
          <TextField
            label="Цена"
            name="price"
            value={newItem.price}
            onChange={handleChange}
            fullWidth
            type="number"
            margin="normal"
          />
          <Button type="submit" variant="contained">Добавить</Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default OrderDetail;