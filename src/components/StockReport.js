import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Box,
} from '@mui/material';

function StockReport() {
  const [products, setProducts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ product: '', quantity: '', movement_type: 'in', comment: '' });

  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', unit: '', quantity: '' });

  // Fetch products and entries on component mount
  useEffect(() => {
    fetchProducts();
    fetchEntries();
  }, []);

  // Fetch products from API
  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/api/products/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setProducts(res.data))
      .catch(err => console.error("Ошибка при получении продуктов:", err));
  };

  // Fetch stock entries from API
  const fetchEntries = () => {
    axios.get('http://127.0.0.1:8000/api/entries/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setEntries(res.data))
      .catch(err => console.error("Ошибка при получении движений:", err));
  };

  // Handle form submit for stock entry movement
  const handleSubmit = () => {
    if (form.product && form.quantity) {
      const payload = {
        ...form,
        quantity: parseInt(form.quantity, 10), // Преобразуем quantity в число
        entry_type: form.movement_type, // Переименовываем movement_type в entry_type
      };
      console.log('Отправляемые данные:', payload); // Для отладки
      axios
        .post('http://127.0.0.1:8000/api/entries/', payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(() => {
          fetchEntries();
          setForm({ product: '', quantity: '', movement_type: 'in', comment: '' });
        })
        .catch(err => {
          const errorMessage = err.response?.data
            ? Object.values(err.response.data).flat().join(', ')
            : 'Не удалось добавить запись';
          console.error('Ошибка при добавлении записи:', err.response?.data);
          alert(`Ошибка: ${errorMessage}`);
        });
    } else {
      alert('Заполните все поля корректно!');
    }
  };

  // Handle adding a new product
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.sku && newProduct.unit && newProduct.quantity) {
      axios
        .post(
          'http://127.0.0.1:8000/api/products/',
          newProduct,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        )
        .then(() => {
          setOpen(false);
          setNewProduct({ name: '', sku: '', unit: '', quantity: '' });
          fetchProducts();
        })
        .catch(err => {
          console.error('Ошибка при добавлении продукта', err.response?.data);
          alert(`Ошибка: ${err.response?.data?.quantity?.join(', ') || 'Не удалось добавить продукт'}`);
        });
    } else {
      alert('Пожалуйста, заполните все поля для нового продукта!');
    }
  };

  // Calculate stock based on entries (positive for in, negative for out)
  const stockMap = {};
  entries.forEach(entry => {
    const qty = entry.movement_type === 'in' ? entry.quantity : -entry.quantity;
    stockMap[entry.product] = (stockMap[entry.product] || 0) + qty;
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Отчёт по остаткам</Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Добавить движение по складу</Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Продукт</InputLabel>
          <Select
            value={form.product}
            label="Продукт"
            onChange={e => setForm({ ...form, product: e.target.value })}
          >
            {products.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Количество"
          fullWidth
          type="number"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Тип движения</InputLabel>
          <Select
            value={form.movement_type}
            label="Тип движения"
            onChange={e => setForm({ ...form, movement_type: e.target.value })}
          >
            <MenuItem value="in">Поступление</MenuItem>
            <MenuItem value="out">Списание</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Комментарий"
          fullWidth
          value={form.comment}
          onChange={e => setForm({ ...form, comment: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={handleSubmit}>СОХРАНИТЬ</Button>
          <Button variant="outlined" onClick={() => setOpen(true)}>Добавить продукт</Button>
        </Box>
      </Paper>

      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Продукт</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Остаток</TableCell>
            <TableCell>Ед.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.sku}</TableCell>
              <TableCell>{stockMap[p.id] || 0}</TableCell>
              <TableCell>{p.unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Новый продукт</DialogTitle>
        <DialogContent>
  <TextField
    label="Название"
    fullWidth
    margin="normal"
    value={newProduct.name}
    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
  />
  <TextField
    label="SKU"
    fullWidth
    margin="normal"
    value={newProduct.sku}
    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
  />
  <TextField
    label="Единица измерения"
    fullWidth
    margin="normal"
    value={newProduct.unit}
    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
  />
  <TextField
    label="Начальное количество"
    fullWidth
    margin="normal"
    type="number"
    value={newProduct.quantity}
    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
  />
</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleAddProduct} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default StockReport;
