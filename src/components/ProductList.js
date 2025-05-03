import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Список товаров</Typography>
      <Paper>
        <List>
          {products.map(p => (
            <ListItem key={p.id} divider>
              <ListItemText primary={p.name} secondary={`SKU: ${p.sku}, Ед: ${p.unit}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default ProductList;