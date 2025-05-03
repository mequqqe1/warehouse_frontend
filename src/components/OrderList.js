import React, { useEffect, useState } from 'react';
import api from '../api/api';
import {
  Container, Typography, List, ListItem, ListItemText, Paper
} from '@mui/material';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('orders/')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Заказы на закупку</Typography>
      <Paper>
        <List>
          {orders.map(order => (
            <ListItem key={order.id} divider>
              <ListItemText
                primary={`Заказ #${order.id} от ${order.date}`}
                secondary={`Поставщик ID: ${order.supplier}, Статус: ${order.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default OrderList;